import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'bday-session',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3333);
}

bootstrap();
