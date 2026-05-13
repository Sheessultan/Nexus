import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class MeController {
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: { user: { username: string } }) {
    return { ok: true, username: req.user.username };
  }
}
