import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173", "https://mmi.marccode.com"],
    credentials: true,
  });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Serve React frontend fra /client/dist
  app.useStaticAssets(join(__dirname, "..", "..", "client", "dist"));
  app.setBaseViewsDir(join(__dirname, "..", "..", "client", "dist"));
  app.use((req, res, next) => {
    res.sendFile(join(__dirname, "..", "..", "client", "dist", "index.html"));
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
}

bootstrap();
