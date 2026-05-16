import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PowershellParserService } from './powershell-parser.service';
export declare class ConsoleGateway implements OnGatewayDisconnect {
    private readonly powershellParser;
    server: Server;
    constructor(powershellParser: PowershellParserService);
    private agentSocketId;
    private readonly shellWaiters;
    private readonly portalWaiters;
    private readonly psParseWaiters;
    private readonly terminalLineBuffers;
    private bufferKey;
    private clearPsParseWaiters;
    private waitAgentPsParse;
    private resolvePowershellComplete;
    handleDisconnect(client: Socket): void;
    agentHello(body: Record<string, unknown>): void;
    agentRegister(client: Socket): void;
    terminalInput(client: Socket, body: {
        data?: string;
        shell?: string;
        force?: boolean;
    }): Promise<void>;
    agentPowershellParseResult(agent: Socket, body: {
        requestId?: string;
        complete?: boolean;
        error?: string;
    }): void;
    shellOutput(agent: Socket, body: {
        requestId?: string;
        chunk?: string;
        shell?: string;
    }): void;
    ptyStart(client: Socket, body: {
        sessionId?: string;
        shell?: string;
        rows?: number;
        cols?: number;
    }): void;
    ptyInput(client: Socket, body: {
        sessionId?: string;
        data?: string;
    }): void;
    ptyResize(client: Socket, body: {
        sessionId?: string;
        rows?: number;
        cols?: number;
    }): void;
    ptyClose(client: Socket, body: {
        sessionId?: string;
    }): void;
    ptyAgentOutput(agent: Socket, body: {
        clientId?: string;
        sessionId?: string;
        data?: string;
        shell?: string;
        error?: string;
        eof?: boolean;
    }): void;
    shellDone(agent: Socket, body: {
        requestId?: string;
        exitCode?: number;
        shell?: string;
    }): void;
    screenControl(client: Socket, body: {
        action?: string;
        fps?: number;
        monitor?: number;
    }): void;
    agentScreenFrame(agent: Socket, body: Record<string, unknown>): void;
    portalRequest(client: Socket, body: {
        requestId?: string;
        type?: string;
        payload?: unknown;
    }): void;
    portalResponse(agent: Socket, body: {
        requestId?: string;
        ok?: boolean;
        data?: unknown;
        error?: string;
    }): void;
}
