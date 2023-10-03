import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import secureSession from '@fastify/secure-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(secureSession, {
    secret: '����!V��h�VKd0���ޯLG�hK�/',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      httpOnly: true,
    },
    cookieName: 'bday_session',
  });

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
