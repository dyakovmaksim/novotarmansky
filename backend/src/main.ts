import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Hide the underlying framework from public responses. Nginx applies the
  // remaining browser-facing security headers at the trusted edge.
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  const uploadsDir =
    process.env.PROMOTIONS_UPLOAD_DIR ?? join(process.cwd(), 'uploads');
  await Promise.all([
    mkdir(join(uploadsDir, 'promotions'), { recursive: true }),
    mkdir(join(uploadsDir, 'gallery'), { recursive: true }),
  ]);
  app.useStaticAssets(uploadsDir, { prefix: '/api/uploads' });

  // All HTTP endpoints live under /api so a single domain can serve both the
  // frontend (/) and the API (/api/*) behind one nginx without CORS dance.
  app.setGlobalPrefix('api');

  // We sit behind nginx in production. Without this throttler & req.ip see
  // nginx's IP for every request, defeating per-IP rate limiting.
  app.set('trust proxy', 1);

  // Otherwise OnApplicationShutdown hooks (e.g. TelegramService.stopped) don't fire on SIGTERM.
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip fields not in the DTO
      forbidNonWhitelisted: true, // 400 on extra fields instead of silent strip
      transform: true, // auto-convert payload to DTO instance
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    methods: 'GET,HEAD,POST',
  });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
