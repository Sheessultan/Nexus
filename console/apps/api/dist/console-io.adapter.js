"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class ConsoleIoAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
    }
    createIOServer(port, options) {
        const serverOptions = {
            ...options,
            cors: { origin: true, credentials: false },
            maxHttpBufferSize: 120_000_000,
            connectTimeout: 45_000,
            pingTimeout: 120_000,
            perMessageDeflate: false,
        };
        return super.createIOServer(port, serverOptions);
    }
}
exports.ConsoleIoAdapter = ConsoleIoAdapter;
//# sourceMappingURL=console-io.adapter.js.map