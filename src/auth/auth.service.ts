import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    try {
      // save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // delete password hash from user
      delete user.hash;

      // return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // duplicate key error
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }

      throw error;
    }
  }

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

    // delete password hash from user
    delete user.hash;

    // send back user
    return user;
  }
}
