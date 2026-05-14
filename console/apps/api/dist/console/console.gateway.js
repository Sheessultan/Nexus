"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleGateway = void 0;
const crypto_1 = require("crypto");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const powershell_parser_service_1 = require("./powershell-parser.service");
const ps_script_complete_1 = require("./ps-script-complete");
let ConsoleGateway = class ConsoleGateway {
    constructor(powershellParser) {
        this.powershellParser = powershellParser;
        this.agents = new Map();
        this.shellWaiters = new Map();
        this.portalWaiters = new Map();
        this.psParseWaiters = new Map();
        this.terminalLineBuffers = new Map();
    }
    viewerRoom(machineId) {
        return `viewer:${machineId}`;
    }
    bufferKey(clientId, shell) {
        return `${clientId}:${shell}`;
    }
    buildRosterPayload() {
        const agents = [...this.agents.entries()].map(([machineId, v]) => ({
            machineId,
            host: v.host,
        }));
        return { agents };
    }
    broadcastRoster() {
        this.server.emit('agents:roster', this.buildRosterPayload());
    }
    handleConnection(client) {
        client.emit('agents:roster', this.buildRosterPayload());
    }
    clearPsParseWaitersForAgent(agentSocketId, reason) {
        const err = new Error(reason);
        for (const [rid, w] of [...this.psParseWaiters.entries()]) {
            if (w.agentSocketId !== agentSocketId)
                continue;
            clearTimeout(w.timer);
            w.reject(err);
            this.psParseWaiters.delete(rid);
        }
    }
    effectiveMachineId(client) {
        const chosen = client.data.targetMachineId;
        if (chosen && this.agents.has(chosen)) {
            return chosen;
        }
        if (this.agents.size === 1) {
            return [...this.agents.keys()][0];
        }
        return null;
    }
    getAgentSocketIdForBrowser(client) {
        const mid = this.effectiveMachineId(client);
        if (!mid)
            return null;
        return this.agents.get(mid)?.socketId ?? null;
    }
    async waitAgentPsParse(agentSocketId, text) {
        return await new Promise((resolve, reject) => {
            const rid = (0, crypto_1.randomUUID)();
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
    async resolvePowershellComplete(merged, agentSocketId) {
        if (this.powershellParser.isAvailable()) {
            try {
                return await this.powershellParser.isSyntacticallyComplete(merged);
            }
            catch {
            }
        }
        if (agentSocketId) {
            try {
                return await this.waitAgentPsParse(agentSocketId, merged);
            }
            catch {
            }
        }
        return (0, ps_script_complete_1.isPowershellScriptComplete)(merged);
    }
    handleDisconnect(client) {
        if (client.data.isAgent === true && typeof client.data.machineId === 'string') {
            const mid = client.data.machineId;
            const cur = this.agents.get(mid);
            if (cur?.socketId === client.id) {
                this.agents.delete(mid);
                this.broadcastRoster();
            }
            this.clearPsParseWaitersForAgent(client.id, 'Agent disconnected');
            this.server.emit('log:line', { line: `[console] Agent disconnected (${mid}).` });
        }
        else {
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
    agentHello(body) {
        const host = typeof body?.host === 'string' ? body.host : '?';
        const mid = typeof body?.machineId === 'string' ? body.machineId : '';
        this.server.emit('log:line', {
            line: `[console] Agent hello from ${host}${mid ? ` [${mid.slice(0, 8)}…]` : ''}`,
        });
    }
    agentRegister(client, body) {
        const machineId = typeof body?.machineId === 'string' && body.machineId.trim().length > 0
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
    consoleSetTarget(client, body) {
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
        const prev = client.data.targetMachineId;
        if (prev && prev !== mid) {
            client.leave(this.viewerRoom(prev));
        }
        client.data.targetMachineId = mid;
        client.join(this.viewerRoom(mid));
        client.emit('log:line', { line: `[console] Target machine: ${this.agents.get(mid)?.host ?? mid}` });
    }
    async terminalInput(client, body) {
        const raw = body?.data ?? '';
        const chunk = raw.replace(/\r?\n$/, '');
        const force = body?.force === true;
        const shell = body?.shell === 'cmd' ? 'cmd' : 'powershell';
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
                data: '\r\n[no agent] Pick an online machine in the header, or start agents: `py src\\main.py --api http://YOUR_API:4000`\r\n',
                shell,
            });
            return;
        }
        if (force) {
            this.terminalLineBuffers.delete(key);
            const requestId = (0, crypto_1.randomUUID)();
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
        let complete;
        if (shell === 'powershell') {
            try {
                complete = await this.resolvePowershellComplete(merged, agentSocketId);
            }
            catch {
                complete = (0, ps_script_complete_1.isPowershellScriptComplete)(merged);
            }
        }
        else {
            complete = (0, ps_script_complete_1.isCmdScriptComplete)(merged);
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
        const requestId = (0, crypto_1.randomUUID)();
        this.shellWaiters.set(requestId, { clientId: client.id, shell });
        this.server.to(agentSocketId).emit('agent:shell_exec', {
            requestId,
            command: merged,
            shell,
        });
    }
    agentPowershellParseResult(agent, body) {
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
    shellOutput(agent, body) {
        const requestId = body?.requestId;
        if (!requestId) {
            return;
        }
        const meta = this.shellWaiters.get(requestId);
        if (!meta) {
            return;
        }
        const shell = (typeof body?.shell === 'string' ? body.shell : meta.shell);
        this.server.to(meta.clientId).emit('terminal:output', {
            data: body?.chunk ?? '',
            shell,
        });
    }
    ptyStart(client, body) {
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
        let shell = 'powershell';
        const s = String(body?.shell || '').toLowerCase();
        if (s === 'cmd') {
            shell = 'cmd';
        }
        else if (s === 'powershell_admin') {
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
    ptyInput(client, body) {
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
    ptyResize(client, body) {
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
    ptyClose(client, body) {
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
    ptyAgentOutput(_agent, body) {
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
    shellDone(_agent, body) {
        const requestId = body?.requestId;
        if (!requestId) {
            return;
        }
        this.shellWaiters.delete(requestId);
    }
    screenControl(client, body) {
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
    agentScreenFrame(agent, body) {
        const mid = agent.data.machineId;
        if (!mid) {
            return;
        }
        this.server.to(this.viewerRoom(mid)).emit('screen:frame', body);
    }
    portalRequest(client, body) {
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
    portalResponse(agent, body) {
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
};
exports.ConsoleGateway = ConsoleGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ConsoleGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:hello'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "agentHello", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "agentRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('console:set_target'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "consoleSetTarget", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('terminal:input'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ConsoleGateway.prototype, "terminalInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:powershell_parse_result'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "agentPowershellParseResult", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:shell_output'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "shellOutput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "ptyStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty:input'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "ptyInput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty:resize'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "ptyResize", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pty:close'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "ptyClose", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:pty_output'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "ptyAgentOutput", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:shell_done'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "shellDone", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('screen:control'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "screenControl", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:screen_frame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "agentScreenFrame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('portal:request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "portalRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agent:portal_response'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "portalResponse", null);
exports.ConsoleGateway = ConsoleGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/console',
        cors: { origin: true, credentials: false },
    }),
    __metadata("design:paramtypes", [powershell_parser_service_1.PowershellParserService])
], ConsoleGateway);
//# sourceMappingURL=console.gateway.js.map