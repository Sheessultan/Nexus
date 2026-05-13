import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConsoleModule } from './console/console.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-me',
      signOptions: { expiresIn: '8h' },
    }),
    AuthModule,
    ConsoleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
