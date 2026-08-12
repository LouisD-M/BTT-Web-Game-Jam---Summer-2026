import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.enableCors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL ??
        'http://localhost:5173',
    ],
    credentials: true,
  });

  const port =
    Number(
      process.env.PORT,
    ) || 9025;

  await app.listen(
    port,
    '0.0.0.0',
  );


}

bootstrap();