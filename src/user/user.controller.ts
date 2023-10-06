import { Body, Controller, Get, Patch, Session } from '@nestjs/common';
import { User } from '@prisma/client';
// import * as secureSession from '@fastify/secure-session';
// import { AuthService } from '../auth/auth.service';
import { GetUser } from '../auth/decorator';
// import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //, @Session() session: secureSession.Session
  @Get('me')
  getMe(@GetUser() user: User, @Session() session: Record<string, any>) {
    // this.authService.checkSession(session);
    console.log(
      'SESSION!@$!#@%@#!%$!#@%^!%^:\n',
      session,
      '\n',
      session.id,
      '\n',
      session.cookie.expires,
    );
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
