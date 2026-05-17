import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.argv.includes('--seed')) {
    const app = await NestFactory.createApplicationContext(AppModule);
    await app.close();
    process.exit(0);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
