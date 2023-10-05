import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // Session,
} from '@nestjs/common';
// import * as secureSession from '@fastify/secure-session';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Session() session: secureSession.Session,
  // POST /signup
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // @Session() session: secureSession.Session,
  // POST /signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  // @Session() session: secureSession.Session
  // POST /signout
  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
