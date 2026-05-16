import { randomUUID } from 'crypto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { PowershellParserService } from './powershell-parser.service';
import { isCmdScriptComplete, isPowershellScriptComplete } from './ps-script-complete';

type ShellKind = 'cmd' | 'powershell';
type PtyShellKind = 'cmd' | 'powershell' | 'powershell_admin';

@WebSocketGateway({
  namespace: '/console',
  cors: { origin: true, credentials: false },
})
export class ConsoleGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly powershellParser: PowershellParserService) {}

  private agentSocketId: string | null = null;
  private readonly shellWaiters = new Map<string, { clientId: string; shell: ShellKind }>();
  private readonly portalWaiters = new Map<string, string>();
  /** Pending `agent:powershell_parse_result` callbacks (API has no local powershell.exe). */
  private readonly psParseWaiters = new Map<
    string,
    { resolve: (v: boolean) => void; reject: (e: Error) => void; timer: NodeJS.Timeout }
  >();
  /** Multi-line `terminal:input` buffer per browser client + shell (Quick tools / legacy line mode). */
  private readonly terminalLineBuffers = new Map<string, string>();

  private bufferKey(clientId: string, shell: ShellKind): string {
    return `${clientId}:${shell}`;
  }

  private clearPsParseWaiters(reason: string): void {
    const err = new Error(reason);
    for (const [, w] of this.psParseWaiters) {
      clearTimeout(w.timer);
      w.reject(err);
    }
    this.psParseWaiters.clear();
  }

  private async waitAgentPsParse(text: string): Promise<boolean> {
    if (!this.agentSocketId) {
      throw new Error('No agent');
    }
    return await new Promise<boolean>((resolve, reject) => {
      const rid = randomUUID();
      const timer = setTimeout(() => {
        this.psParseWaiters.delete(rid);
        reject(new Error('PowerShell parse request timed out'));
      }, 14_000);
      this.psParseWaiters.set(rid, {
        resolve: (v) => {
          clearTimeout(timer);
          this.psParseWaiters.delete(rid);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          this.psParseWaiters.delete(rid);
          reject(e);
        },
        timer,
      });
      this.server.to(this.agentSocketId!).emit('agent:powershell_parse', { requestId: rid, text });
    });
  }

  private async resolvePowershellComplete(merged: string): Promise<boolean> {
    if (this.powershellParser.isAvailable()) {
      try {
        return await this.powershellParser.isSyntacticallyComplete(merged);
      } catch {
        /* fall through */
      }
    }
    if (this.agentSocketId) {
      try {
        return await this.waitAgentPsParse(merged);
      } catch {
        /* fall through */
      }
    }
    return isPowershellScriptComplete(merged);
  }

  handleDisconnect(client: Socket) {
    if (this.agentSocketId === client.id) {
      this.agentSocketId = null;
      this.clearPsParseWaiters('Agent disconnected');
      this.server.emit('log:line', { line: '[console] Agent disconnected.' });
    } else if (this.agentSocketId) {
      this.server.to(this.agentSocketId).emit('agent:pty_client_gone', { clientId: client.id });
    }
    const prefix = `${client.id}:`;
    for (const k of [...this.terminalLineBuffers.keys()]) {
      if (k.startsWith(prefix)) {
        this.terminalLineBuffers.delete(k);
      }
    }
  }

  @SubscribeMessage('agent:hello')
  agentHello(@MessageBody() body: Record<string, unknown>) {
    const host = typeof body?.host === 'string' ? body.host : '?';
    this.server.emit('log:line', { line: `[console] Agent hello from ${host}` });
  }

  @SubscribeMessage('agent:register')
  agentRegister(@ConnectedSocket() client: Socket) {
    this.agentSocketId = client.id;
    this.server.emit('log:line', {
      line: `[console] Agent registered (socket ${client.id}).`,
    });
    this.server.emit('agent:ready', { ok: true });
  }

  @SubscribeMessage('terminal:input')
  async terminalInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { data?: string; shell?: string; force?: boolean },
  ) {
    const raw = body?.data ?? '';
    const chunk = raw.replace(/\r?\n$/, '');
    const force = body?.force === true;
    const shell: ShellKind = body?.shell === 'cmd' ? 'cmd' : 'powershell';
    const key = this.bufferKey(client.id, shell);

    if (!force) {
      const hasBuffer = (this.terminalLineBuffers.get(key) ?? '').length > 0;
      if (!hasBuffer && !chunk.trim()) {
        return;
      }
    }

    if (!this.agentSocketId) {
      client.emit('terminal:output', {
        data:
          '\r\n[no agent] Start the Windows agent from the agent folder: `py src\\main.py --api http://127.0.0.1:4000`\r\n',
        shell,
      });
      return;
    }

    if (force) {
      this.terminalLineBuffers.delete(key);
      const requestId = randomUUID();
      this.shellWaiters.set(requestId, { clientId: client.id, shell });
      this.server.to(this.agentSocketId).emit('agent:shell_exec', {
        requestId,
        command: chunk,
        shell,
      });
      return;
    }

    const prev = this.terminalLineBuffers.get(key) ?? '';
    const merged = prev ? `${prev}\n${chunk}` : chunk;

    let complete: boolean;
    if (shell === 'powershell') {
      try {
        complete = await this.resolvePowershellComplete(merged);
      } catch {
        complete = isPowershellScriptComplete(merged);
      }
    } else {
      complete = isCmdScriptComplete(merged);
    }

    if (!complete) {
      this.terminalLineBuffers.set(key, merged);
      if (shell === 'powershell') {
        client.emit('terminal:output', { data: '\r\n>> ', shell });
      }
      return;
    }

    const bodyNorm = merged.replace(/\r\n/g, '\n').trimEnd();
    if (!bodyNorm.trim()) {
      this.terminalLineBuffers.delete(key);
      return;
    }

    this.terminalLineBuffers.delete(key);
    const requestId = randomUUID();
    this.shellWaiters.set(requestId, { clientId: client.id, shell });
    this.server.to(this.agentSocketId).emit('agent:shell_exec', {
      requestId,
      command: merged,
      shell,
    });
  }

  @SubscribeMessage('agent:powershell_parse_result')
  agentPowershellParseResult(
    @ConnectedSocket() agent: Socket,
    @MessageBody() body: { requestId?: string; complete?: boolean; error?: string },
  ) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    const requestId = typeof body?.requestId === 'string' ? body.requestId : '';
    if (!requestId) {
      return;
    }
    const w = this.psParseWaiters.get(requestId);
    if (!w) {
      return;
    }
    if (body.error) {
      w.reject(new Error(body.error));
      return;
    }
    w.resolve(body.complete === true);
  }

  @SubscribeMessage('agent:shell_output')
  shellOutput(
    @ConnectedSocket() agent: Socket,
    @MessageBody() body: { requestId?: string; chunk?: string; shell?: string },
  ) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    const requestId = body?.requestId;
    if (!requestId) {
      return;
    }
    const meta = this.shellWaiters.get(requestId);
    if (!meta) {
      return;
    }
    const shell = (typeof body?.shell === 'string' ? body.shell : meta.shell) as ShellKind;
    this.server.to(meta.clientId).emit('terminal:output', {
      data: body?.chunk ?? '',
      shell,
    });
  }

  @SubscribeMessage('pty:start')
  ptyStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { sessionId?: string; shell?: string; rows?: number; cols?: number },
  ) {
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    if (!this.agentSocketId) {
      client.emit('pty:output', {
        sessionId,
        error: 'No agent connected. Start the Windows agent and refresh.',
      });
      return;
    }
    let shell: PtyShellKind = 'powershell';
    const s = String(body?.shell || '').toLowerCase();
    if (s === 'cmd') {
      shell = 'cmd';
    } else if (s === 'powershell_admin') {
      shell = 'powershell_admin';
    }
    const rows = typeof body?.rows === 'number' ? body.rows : 24;
    const cols = typeof body?.cols === 'number' ? body.cols : 80;
    this.server.to(this.agentSocketId).emit('agent:pty_start', {
      clientId: client.id,
      sessionId,
      shell,
      rows,
      cols,
    });
  }

  @SubscribeMessage('pty:input')
  ptyInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string; data?: string },
  ) {
    if (!this.agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(this.agentSocketId).emit('agent:pty_input', {
      clientId: client.id,
      sessionId,
      data: typeof body?.data === 'string' ? body.data : '',
    });
  }

  @SubscribeMessage('pty:resize')
  ptyResize(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string; rows?: number; cols?: number },
  ) {
    if (!this.agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(this.agentSocketId).emit('agent:pty_resize', {
      clientId: client.id,
      sessionId,
      rows: typeof body?.rows === 'number' ? body.rows : 24,
      cols: typeof body?.cols === 'number' ? body.cols : 80,
    });
  }

  @SubscribeMessage('pty:close')
  ptyClose(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId?: string }) {
    if (!this.agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(this.agentSocketId).emit('agent:pty_close', {
      clientId: client.id,
      sessionId,
    });
  }

  @SubscribeMessage('agent:pty_output')
  ptyAgentOutput(
    @ConnectedSocket() agent: Socket,
    @MessageBody()
    body: {
      clientId?: string;
      sessionId?: string;
      data?: string;
      shell?: string;
      error?: string;
      eof?: boolean;
    },
  ) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    const clientId = typeof body?.clientId === 'string' ? body.clientId : '';
    if (!clientId) {
      return;
    }
    this.server.to(clientId).emit('pty:output', {
      sessionId: body?.sessionId,
      data: body?.data,
      shell: body?.shell,
      error: body?.error,
      eof: body?.eof === true,
    });
  }

  @SubscribeMessage('agent:shell_done')
  shellDone(
    @ConnectedSocket() agent: Socket,
    @MessageBody() body: { requestId?: string; exitCode?: number; shell?: string },
  ) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    const requestId = body?.requestId;
    if (!requestId) {
      return;
    }
    this.shellWaiters.delete(requestId);
  }

  @SubscribeMessage('screen:control')
  screenControl(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { action?: string; fps?: number; monitor?: number },
  ) {
    if (this.agentSocketId && client.id === this.agentSocketId) {
      return;
    }
    if (!this.agentSocketId) {
      client.emit('log:line', {
        line: '[console] Screen control ignored — no agent connected.',
      });
      return;
    }
    this.server.to(this.agentSocketId).emit('agent:screen_control', {
      action: body?.action,
      fps: body?.fps,
      monitor: body?.monitor,
    });
  }

  @SubscribeMessage('agent:screen_frame')
  agentScreenFrame(@ConnectedSocket() agent: Socket, @MessageBody() body: Record<string, unknown>) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    // Broadcast to every socket in this namespace (agent ignores unknown events).
    // Using only .except() was dropping frames in some Nest / Socket.IO combinations.
    this.server.emit('screen:frame', body);
  }

  @SubscribeMessage('portal:request')
  portalRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { requestId?: string; type?: string; payload?: unknown },
  ) {
    const requestId = body?.requestId;
    if (!requestId) {
      return;
    }
    if (!this.agentSocketId) {
      client.emit('portal:result', {
        requestId,
        ok: false,
        error: 'No agent connected.',
      });
      return;
    }
    this.portalWaiters.set(requestId, client.id);
    this.server.to(this.agentSocketId).emit('agent:portal_request', {
      requestId,
      type: body?.type,
      payload: body?.payload,
    });
  }

  @SubscribeMessage('agent:portal_response')
  portalResponse(
    @ConnectedSocket() agent: Socket,
    @MessageBody()
    body: {
      requestId?: string;
      ok?: boolean;
      data?: unknown;
      error?: string;
    },
  ) {
    if (!this.agentSocketId || agent.id !== this.agentSocketId) {
      return;
    }
    const requestId = body?.requestId;
    if (!requestId) {
      return;
    }
    const target = this.portalWaiters.get(requestId);
    this.portalWaiters.delete(requestId);
    if (!target) {
      return;
    }
    this.server.to(target).emit('portal:result', {
      requestId,
      ok: body?.ok !== false,
      data: body?.data,
      error: body?.error,
    });
  }
}
