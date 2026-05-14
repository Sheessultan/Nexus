import { randomUUID } from 'crypto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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

type AgentRecord = { socketId: string; host: string };

@WebSocketGateway({
  namespace: '/console',
  cors: { origin: true, credentials: false },
})
export class ConsoleGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly powershellParser: PowershellParserService) {}

  /** Stable id from agent (UUID file); value is current Socket.IO id for that agent. */
  private readonly agents = new Map<string, AgentRecord>();
  private readonly shellWaiters = new Map<string, { clientId: string; shell: ShellKind }>();
  private readonly portalWaiters = new Map<string, string>();
  /** Pending `agent:powershell_parse_result` callbacks (API has no local powershell.exe). */
  private readonly psParseWaiters = new Map<
    string,
    {
      agentSocketId: string;
      resolve: (v: boolean) => void;
      reject: (e: Error) => void;
      timer: NodeJS.Timeout;
    }
  >();
  /** Multi-line `terminal:input` buffer per browser client + shell (Quick tools / legacy line mode). */
  private readonly terminalLineBuffers = new Map<string, string>();

  private viewerRoom(machineId: string): string {
    return `viewer:${machineId}`;
  }

  private bufferKey(clientId: string, shell: ShellKind): string {
    return `${clientId}:${shell}`;
  }

  private buildRosterPayload(): { agents: { machineId: string; host: string }[] } {
    const agents = [...this.agents.entries()].map(([machineId, v]) => ({
      machineId,
      host: v.host,
    }));
    return { agents };
  }

  private broadcastRoster(): void {
    this.server.emit('agents:roster', this.buildRosterPayload());
  }

  handleConnection(client: Socket) {
    client.emit('agents:roster', this.buildRosterPayload());
  }

  private clearPsParseWaitersForAgent(agentSocketId: string, reason: string): void {
    const err = new Error(reason);
    for (const [rid, w] of [...this.psParseWaiters.entries()]) {
      if (w.agentSocketId !== agentSocketId) continue;
      clearTimeout(w.timer);
      w.reject(err);
      this.psParseWaiters.delete(rid);
    }
  }

  private effectiveMachineId(client: Socket): string | null {
    const chosen = client.data.targetMachineId as string | undefined;
    if (chosen && this.agents.has(chosen)) {
      return chosen;
    }
    if (this.agents.size === 1) {
      return [...this.agents.keys()][0]!;
    }
    return null;
  }

  private getAgentSocketIdForBrowser(client: Socket): string | null {
    const mid = this.effectiveMachineId(client);
    if (!mid) return null;
    return this.agents.get(mid)?.socketId ?? null;
  }

  private async waitAgentPsParse(agentSocketId: string, text: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      const rid = randomUUID();
      const timer = setTimeout(() => {
        this.psParseWaiters.delete(rid);
        reject(new Error('PowerShell parse request timed out'));
      }, 14_000);
      this.psParseWaiters.set(rid, {
        agentSocketId,
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
      this.server.to(agentSocketId).emit('agent:powershell_parse', { requestId: rid, text });
    });
  }

  private async resolvePowershellComplete(merged: string, agentSocketId: string | null): Promise<boolean> {
    if (this.powershellParser.isAvailable()) {
      try {
        return await this.powershellParser.isSyntacticallyComplete(merged);
      } catch {
        /* fall through */
      }
    }
    if (agentSocketId) {
      try {
        return await this.waitAgentPsParse(agentSocketId, merged);
      } catch {
        /* fall through */
      }
    }
    return isPowershellScriptComplete(merged);
  }

  handleDisconnect(client: Socket) {
    if (client.data.isAgent === true && typeof client.data.machineId === 'string') {
      const mid = client.data.machineId as string;
      const cur = this.agents.get(mid);
      if (cur?.socketId === client.id) {
        this.agents.delete(mid);
        this.broadcastRoster();
      }
      this.clearPsParseWaitersForAgent(client.id, 'Agent disconnected');
      this.server.emit('log:line', { line: `[console] Agent disconnected (${mid}).` });
    } else {
      for (const a of this.agents.values()) {
        this.server.to(a.socketId).emit('agent:pty_client_gone', { clientId: client.id });
      }
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
    const mid = typeof body?.machineId === 'string' ? body.machineId : '';
    this.server.emit('log:line', {
      line: `[console] Agent hello from ${host}${mid ? ` [${mid.slice(0, 8)}…]` : ''}`,
    });
  }

  @SubscribeMessage('agent:register')
  agentRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { machineId?: string; host?: string; userName?: string },
  ) {
    const machineId =
      typeof body?.machineId === 'string' && body.machineId.trim().length > 0
        ? body.machineId.trim().slice(0, 128)
        : client.id;
    const host = typeof body?.host === 'string' ? body.host : '?';
    client.data.isAgent = true;
    client.data.machineId = machineId;
    this.agents.set(machineId, { socketId: client.id, host });
    this.broadcastRoster();
    this.server.emit('log:line', {
      line: `[console] Agent registered: ${host} (${machineId}).`,
    });
  }

  @SubscribeMessage('console:set_target')
  consoleSetTarget(@ConnectedSocket() client: Socket, @MessageBody() body: { machineId?: string }) {
    if (client.data.isAgent) {
      return;
    }
    const mid = typeof body?.machineId === 'string' ? body.machineId.trim() : '';
    if (!mid || !this.agents.has(mid)) {
      client.emit('log:line', {
        line: `[console] Unknown or offline machine: ${mid || '(empty)'}`,
      });
      return;
    }
    const prev = client.data.targetMachineId as string | undefined;
    if (prev && prev !== mid) {
      client.leave(this.viewerRoom(prev));
    }
    client.data.targetMachineId = mid;
    client.join(this.viewerRoom(mid));
    client.emit('log:line', { line: `[console] Target machine: ${this.agents.get(mid)?.host ?? mid}` });
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

    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      client.emit('terminal:output', {
        data:
          '\r\n[no agent] Pick an online machine in the header, or start agents: `py src\\main.py --api http://YOUR_API:4000`\r\n',
        shell,
      });
      return;
    }

    if (force) {
      this.terminalLineBuffers.delete(key);
      const requestId = randomUUID();
      this.shellWaiters.set(requestId, { clientId: client.id, shell });
      this.server.to(agentSocketId).emit('agent:shell_exec', {
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
        complete = await this.resolvePowershellComplete(merged, agentSocketId);
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
    this.server.to(agentSocketId).emit('agent:shell_exec', {
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
    const requestId = typeof body?.requestId === 'string' ? body.requestId : '';
    if (!requestId) {
      return;
    }
    const w = this.psParseWaiters.get(requestId);
    if (!w || w.agentSocketId !== agent.id) {
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
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      client.emit('pty:output', {
        sessionId,
        error: 'No agent for this session. Select a machine in the header.',
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
    this.server.to(agentSocketId).emit('agent:pty_start', {
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
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentSocketId).emit('agent:pty_input', {
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
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentSocketId).emit('agent:pty_resize', {
      clientId: client.id,
      sessionId,
      rows: typeof body?.rows === 'number' ? body.rows : 24,
      cols: typeof body?.cols === 'number' ? body.cols : 80,
    });
  }

  @SubscribeMessage('pty:close')
  ptyClose(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId?: string }) {
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentSocketId).emit('agent:pty_close', {
      clientId: client.id,
      sessionId,
    });
  }

  @SubscribeMessage('agent:pty_output')
  ptyAgentOutput(
    @ConnectedSocket() _agent: Socket,
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
    @ConnectedSocket() _agent: Socket,
    @MessageBody() body: { requestId?: string; exitCode?: number; shell?: string },
  ) {
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
    if (client.data.isAgent) {
      return;
    }
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      client.emit('log:line', {
        line: '[console] Screen control ignored — no agent for this session.',
      });
      return;
    }
    this.server.to(agentSocketId).emit('agent:screen_control', {
      action: body?.action,
      fps: body?.fps,
      monitor: body?.monitor,
    });
  }

  @SubscribeMessage('agent:screen_frame')
  agentScreenFrame(@ConnectedSocket() agent: Socket, @MessageBody() body: Record<string, unknown>) {
    const mid = agent.data.machineId as string | undefined;
    if (!mid) {
      return;
    }
    this.server.to(this.viewerRoom(mid)).emit('screen:frame', body);
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
    const agentSocketId = this.getAgentSocketIdForBrowser(client);
    if (!agentSocketId) {
      client.emit('portal:result', {
        requestId,
        ok: false,
        error: 'No agent connected. Select a machine or wait for an agent to register.',
      });
      return;
    }
    this.portalWaiters.set(requestId, client.id);
    this.server.to(agentSocketId).emit('agent:portal_request', {
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
