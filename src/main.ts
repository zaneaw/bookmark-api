import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      name: 'bday-session',
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
      },
      // Ref - https://www.npmjs.com/package/@quixo3/prisma-session-store
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 1000 * 60 * 20, // 20 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3333);
}

bootstrap();
