import { Module } from '@nestjs/common';
import { ConsoleGateway } from './console.gateway';
import { PowershellParserService } from './powershell-parser.service';

@Module({
  providers: [ConsoleGateway, PowershellParserService],
})
export class ConsoleModule {}
