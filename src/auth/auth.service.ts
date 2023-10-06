import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
// import * as secureSession from '@fastify/secure-session';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    // private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // session: secureSession.Session,
  async signup(dto: AuthDto, session: Record<string, any>) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          // duplicate key error
          if (error.code === 'P2002') {
            throw new ForbiddenException('Email already exists');
          }
        }

        throw error;
      });

    return this.createSession(user.id, user.email, session);
  }

  // session: secureSession.Session
  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user doens't exist, throw error
    if (!user) throw new ForbiddenException('Credentials are invalid');

    // compare password hash
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password doesn't match, throw error
    if (!pwMatches) throw new ForbiddenException('Credentials are invalid');

    // send back session cookie
    return this.createSession(user.id, user.email);
  }

  // session: secureSession.Session
  signout() {
    // session.delete();

    return;
  }

  async signToken(
    userId: number,
    email: string,
    // session?: secureSession.Session,
  ): Promise<any> {
    // session.set('user', { userId, email });

    // const sessionAge = 60 * 60 * 24 * 30; // 30 days
    // session.options({ maxAge: 15000 });

    console.log(userId, email);

    return;
  }

  // , session: secureSession.Session
  createSession(userId: number, email: string, session?: Record<string, any>) {
    session.user = { userId, email };
  }

  // function to check if users Cookie session is valid
  // session: secureSession.Session
  async checkSession() {
    console.log('!@$@#^@#$&@%^&$!@#%!@#%!$@#%SESSION!@$@#^%@^%!@^!$');
  }
}
