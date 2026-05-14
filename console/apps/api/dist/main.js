"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const console_io_adapter_1 = require("./console-io.adapter");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new console_io_adapter_1.ConsoleIoAdapter(app));
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const port = Number(process.env.PORT || 4000);
    const host = (process.env.HOST || '0.0.0.0').trim() || '0.0.0.0';
    await app.listen(port, host);
    console.log(`API listening on http://${host}:${port} (from another PC use this machine's LAN IP + port)`);
}
bootstrap();
//# sourceMappingURL=main.js.map