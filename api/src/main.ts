import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Create the application as an Express application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://marcmadeit.vercel.app', 'https://mmi.marccode.com'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  });

  // Serve static assets (React frontend)
  app.useStaticAssets(join(__dirname, '../client'));
  app.setBaseViewsDir(join(__dirname, '../client'));
  app.setViewEngine('html');

  // Other configurations
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
