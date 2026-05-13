import { Module } from '@nestjs/common';
import { ConsoleGateway } from './console.gateway';

@Module({
  providers: [ConsoleGateway],
})
export class ConsoleModule {}
