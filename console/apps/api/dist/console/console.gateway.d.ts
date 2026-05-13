import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ConsoleGateway implements OnGatewayDisconnect {
    server: Server;
    private agentSocketId;
    private readonly shellWaiters;
    private readonly portalWaiters;
    private readonly terminalLineBuffers;
    private bufferKey;
    handleDisconnect(client: Socket): void;
    agentHello(body: Record<string, unknown>): void;
    agentRegister(client: Socket): void;
    terminalInput(client: Socket, body: {
        data?: string;
        shell?: string;
        force?: boolean;
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
