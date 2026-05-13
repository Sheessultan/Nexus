import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  login(username: string, password: string) {
    const u = process.env.CONSOLE_AUTH_USER || 'admin';
    const p = process.env.CONSOLE_AUTH_PASSWORD || 'admin';
    if (username !== u || password !== p) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.jwt.sign({ sub: username, role: 'operator' });
    return { accessToken };
  }

  validatePayload(payload: { sub?: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    return { username: payload.sub };
  }
}
