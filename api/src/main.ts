import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
// import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'https://mmi.marccode.com'],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

//   const frontendPath = '/home/marcmadeit/htdocs/mmi.marccode.com/client/dist';
//   app.useStaticAssets(frontendPath);
//   app.setBaseViewsDir(frontendPath);

//   app.use('*', (req, res, next) => {
//   console.log(`Request URL: ${req.originalUrl}`);
//   if (req.originalUrl.startsWith('/api')) {
//     console.log('API request, passing to NestJS');
//     next(); 
//   } else {
//     console.log('Frontend request, serving index.html');
//     res.sendFile(join(frontendPath, 'index.html')); 
//   }
// });


  // Start the application
  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
}

bootstrap();