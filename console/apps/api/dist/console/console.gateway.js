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
const ps_script_complete_1 = require("./ps-script-complete");
let ConsoleGateway = class ConsoleGateway {
    constructor() {
        this.agentSocketId = null;
        this.shellWaiters = new Map();
        this.portalWaiters = new Map();
        this.terminalLineBuffers = new Map();
    }
    bufferKey(clientId, shell) {
        return `${clientId}:${shell}`;
    }
    handleDisconnect(client) {
        if (this.agentSocketId === client.id) {
            this.agentSocketId = null;
            this.server.emit('log:line', { line: '[console] Agent disconnected.' });
        }
        else if (this.agentSocketId) {
            this.server.to(this.agentSocketId).emit('agent:pty_client_gone', { clientId: client.id });
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
        this.server.emit('log:line', { line: `[console] Agent hello from ${host}` });
    }
    agentRegister(client) {
        this.agentSocketId = client.id;
        this.server.emit('log:line', {
            line: `[console] Agent registered (socket ${client.id}).`,
        });
    }
    terminalInput(client, body) {
        const raw = body?.data ?? '';
        const chunk = raw.replace(/\r?\n$/, '');
        const force = body?.force === true;
        const shell = body?.shell === 'cmd' ? 'cmd' : 'powershell';
        const key = this.bufferKey(client.id, shell);
        if (!chunk.trim() && !force) {
            return;
        }
        if (!this.agentSocketId) {
            client.emit('terminal:output', {
                data: '\r\n[no agent] Start the Windows agent from the agent folder: `py src\\main.py --api http://127.0.0.1:4000`\r\n',
                shell,
            });
            return;
        }
        if (force) {
            this.terminalLineBuffers.delete(key);
            const requestId = (0, crypto_1.randomUUID)();
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
        const complete = shell === 'powershell' ? (0, ps_script_complete_1.isPowershellScriptComplete)(merged) : (0, ps_script_complete_1.isCmdScriptComplete)(merged);
        if (!complete) {
            this.terminalLineBuffers.set(key, merged);
            return;
        }
        this.terminalLineBuffers.delete(key);
        const requestId = (0, crypto_1.randomUUID)();
        this.shellWaiters.set(requestId, { clientId: client.id, shell });
        this.server.to(this.agentSocketId).emit('agent:shell_exec', {
            requestId,
            command: merged,
            shell,
        });
    }
    shellOutput(agent, body) {
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
        if (!this.agentSocketId) {
            client.emit('pty:output', {
                sessionId,
                error: 'No agent connected. Start the Windows agent and refresh.',
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
        this.server.to(this.agentSocketId).emit('agent:pty_start', {
            clientId: client.id,
            sessionId,
            shell,
            rows,
            cols,
        });
    }
    ptyInput(client, body) {
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
    ptyResize(client, body) {
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
    ptyClose(client, body) {
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
    ptyAgentOutput(agent, body) {
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
    shellDone(agent, body) {
        if (!this.agentSocketId || agent.id !== this.agentSocketId) {
            return;
        }
        const requestId = body?.requestId;
        if (!requestId) {
            return;
        }
        this.shellWaiters.delete(requestId);
    }
    screenControl(client, body) {
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
    agentScreenFrame(agent, body) {
        if (!this.agentSocketId || agent.id !== this.agentSocketId) {
            return;
        }
        this.server.emit('screen:frame', body);
    }
    portalRequest(client, body) {
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
    portalResponse(agent, body) {
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "agentRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('terminal:input'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ConsoleGateway.prototype, "terminalInput", null);
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
        cors: { origin: true, credentials: true },
    })
], ConsoleGateway);
//# sourceMappingURL=console.gateway.js.map