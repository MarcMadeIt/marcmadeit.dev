import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',  
    credentials: true,
    methods:['GET', 'POST', 'DELETE', 'PUT'],      
  });
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();