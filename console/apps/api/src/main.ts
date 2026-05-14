import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConsoleIoAdapter } from './console-io.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new ConsoleIoAdapter(app));
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = Number(process.env.PORT || 4000);
  /** Bind all interfaces so agents / browsers on the LAN can reach the API (firewall may still block). */
  const host = (process.env.HOST || '0.0.0.0').trim() || '0.0.0.0';
  await app.listen(port, host);
  console.log(`API listening on http://${host}:${port} (from another PC use this machine's LAN IP + port)`);
}

bootstrap();
