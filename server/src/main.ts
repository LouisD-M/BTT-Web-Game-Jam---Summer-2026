import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(9025, '0.0.0.0');

  console.log('API running on http://localhost:9025');
}

bootstrap();