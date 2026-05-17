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

type RegisteredAgent = {
  socketId: string;
  host: string;
  connectedAt: number;
};

@WebSocketGateway({
  namespace: '/console',
  cors: { origin: true, credentials: false },
})
export class ConsoleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly powershellParser: PowershellParserService) {}

  /** All connected Windows agents (socket id → metadata). */
  private readonly agents = new Map<string, RegisteredAgent>();
  /** Browser client → chosen agent socket id. */
  private readonly clientSelectedAgent = new Map<string, string>();
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

  private agentsPayload() {
    return {
      agents: [...this.agents.values()].map((a) => ({
        id: a.socketId,
        host: a.host,
      })),
    };
  }

  private broadcastAgentsList(): void {
    this.server.emit('agents:list', this.agentsPayload());
  }

  private isRegisteredAgent(socketId: string): boolean {
    return this.agents.has(socketId);
  }

  /** Route browser traffic to the machine the user picked (or the only online agent). */
  private agentIdForClient(clientId: string): string | null {
    const picked = this.clientSelectedAgent.get(clientId);
    if (picked && this.agents.has(picked)) {
      return picked;
    }
    if (this.agents.size === 1) {
      return [...this.agents.keys()][0] ?? null;
    }
    if (this.agents.size > 1) {
      const sorted = [...this.agents.values()].sort((a, b) => a.connectedAt - b.connectedAt);
      return sorted[0]?.socketId ?? null;
    }
    return null;
  }

  private clearPsParseWaiters(reason: string): void {
    const err = new Error(reason);
    for (const [, w] of this.psParseWaiters) {
      clearTimeout(w.timer);
      w.reject(err);
    }
    this.psParseWaiters.clear();
  }

  private async waitAgentPsParse(agentId: string, text: string): Promise<boolean> {
    if (!this.agents.has(agentId)) {
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
      this.server.to(agentId).emit('agent:powershell_parse', { requestId: rid, text });
    });
  }

  private async resolvePowershellComplete(merged: string, agentId: string | null): Promise<boolean> {
    if (this.powershellParser.isAvailable()) {
      try {
        return await this.powershellParser.isSyntacticallyComplete(merged);
      } catch {
        /* fall through */
      }
    }
    if (agentId) {
      try {
        return await this.waitAgentPsParse(agentId, merged);
      } catch {
        /* fall through */
      }
    }
    return isPowershellScriptComplete(merged);
  }

  handleConnection(client: Socket) {
    client.emit('agents:list', this.agentsPayload());
  }

  handleDisconnect(client: Socket) {
    if (this.isRegisteredAgent(client.id)) {
      const host = this.agents.get(client.id)?.host ?? client.id;
      this.agents.delete(client.id);
      for (const [browserId, agentId] of [...this.clientSelectedAgent.entries()]) {
        if (agentId === client.id) {
          this.clientSelectedAgent.delete(browserId);
        }
      }
      this.clearPsParseWaiters('Agent disconnected');
      this.server.emit('log:line', { line: `[console] Agent disconnected (${host}).` });
      this.broadcastAgentsList();
    } else if (this.agents.size > 0) {
      for (const agent of this.agents.keys()) {
        this.server.to(agent).emit('agent:pty_client_gone', { clientId: client.id });
      }
      this.clientSelectedAgent.delete(client.id);
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
  agentRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    const host =
      typeof body?.host === 'string' && body.host.trim()
        ? body.host.trim()
        : typeof body?.hostname === 'string'
          ? body.hostname
          : client.id.slice(0, 8);
    this.agents.set(client.id, {
      socketId: client.id,
      host,
      connectedAt: Date.now(),
    });
    this.server.emit('log:line', {
      line: `[console] Agent registered: ${host} (${client.id}).`,
    });
    this.broadcastAgentsList();
    this.server.emit('agent:ready', { ok: true, agentId: client.id, host });
  }

  @SubscribeMessage('console:select_agent')
  selectAgent(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { agentId?: string },
  ) {
    const agentId = typeof body?.agentId === 'string' ? body.agentId : '';
    if (!agentId || !this.agents.has(agentId)) {
      return;
    }
    this.clientSelectedAgent.set(client.id, agentId);
    const host = this.agents.get(agentId)?.host ?? agentId;
    this.server.emit('log:line', {
      line: `[console] Browser ${client.id.slice(0, 8)}… selected agent ${host}.`,
    });
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

    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      const hint =
        this.agents.size > 1
          ? '\r\n[no agent selected] Pick a machine in the header dropdown.\r\n'
          : '\r\n[no agent] Start the Windows agent: `py src\\main.py --api http://YOUR_SERVER:4000`\r\n';
      client.emit('terminal:output', { data: hint, shell });
      return;
    }

    if (force) {
      this.terminalLineBuffers.delete(key);
      const requestId = randomUUID();
      this.shellWaiters.set(requestId, { clientId: client.id, shell });
      this.server.to(agentId).emit('agent:shell_exec', {
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
        complete = await this.resolvePowershellComplete(merged, agentId);
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
    this.server.to(agentId).emit('agent:shell_exec', {
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
    if (!this.isRegisteredAgent(agent.id)) {
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
    if (!this.isRegisteredAgent(agent.id)) {
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
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      const err =
        this.agents.size > 1
          ? 'No agent selected — pick a machine in the header.'
          : 'No agent connected. Start the Windows agent and refresh.';
      client.emit('pty:output', {
        sessionId,
        error: err,
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
    this.server.to(agentId).emit('agent:pty_start', {
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
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentId).emit('agent:pty_input', {
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
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentId).emit('agent:pty_resize', {
      clientId: client.id,
      sessionId,
      rows: typeof body?.rows === 'number' ? body.rows : 24,
      cols: typeof body?.cols === 'number' ? body.cols : 80,
    });
  }

  @SubscribeMessage('pty:close')
  ptyClose(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId?: string }) {
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      return;
    }
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
    if (!sessionId) {
      return;
    }
    this.server.to(agentId).emit('agent:pty_close', {
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
    if (!this.isRegisteredAgent(agent.id)) {
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
    if (!this.isRegisteredAgent(agent.id)) {
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
    if (this.isRegisteredAgent(client.id)) {
      return;
    }
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      client.emit('log:line', {
        line: '[console] Screen control ignored — no agent connected.',
      });
      return;
    }
    this.server.to(agentId).emit('agent:screen_control', {
      action: body?.action,
      fps: body?.fps,
      monitor: body?.monitor,
    });
  }

  @SubscribeMessage('agent:screen_frame')
  agentScreenFrame(@ConnectedSocket() agent: Socket, @MessageBody() body: Record<string, unknown>) {
    if (!this.isRegisteredAgent(agent.id)) {
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
    const agentId = this.agentIdForClient(client.id);
    if (!agentId) {
      client.emit('portal:result', {
        requestId,
        ok: false,
        error:
          this.agents.size > 1
            ? 'No agent selected. Pick a machine in the header.'
            : 'No agent connected.',
      });
      return;
    }
    this.portalWaiters.set(requestId, client.id);
    this.server.to(agentId).emit('agent:portal_request', {
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
    if (!this.isRegisteredAgent(agent.id)) {
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
