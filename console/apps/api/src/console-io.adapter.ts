import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { ServerOptions } from 'socket.io';

/**
 * Default Engine.IO max buffer (~1MB) drops large desktop JPEG/base64 payloads.
 */
export class ConsoleIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const serverOptions = {
      ...options,
      /** Long-polling handshakes send `Origin`; match gateway + HTTP CORS so LAN browsers (http://IP:3000) connect. */
      cors: { origin: true, credentials: false },
      maxHttpBufferSize: 120_000_000,
      connectTimeout: 45_000,
      pingTimeout: 120_000,
      perMessageDeflate: false,
    } as ServerOptions;
    return super.createIOServer(port, serverOptions);
  }
}
