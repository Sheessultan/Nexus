import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { ServerOptions } from 'socket.io';
export declare class ConsoleIoAdapter extends IoAdapter {
    constructor(app: INestApplicationContext);
    createIOServer(port: number, options?: ServerOptions): any;
}
