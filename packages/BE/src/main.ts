import { NestFactory } from "@nestjs/core";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import fs from "node:fs";

import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LanguageInterceptor } from "./common/interceptors/language.interceptor";

const httpsOptions = {
  key: fs.readFileSync("./.cert/key.pem"),
  cert: fs.readFileSync("./.cert/cert.pem"),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: ["error", "warn", "log", "debug", "verbose"],
  });
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
      "http://localhost:4173",
      "https://localhost:4173",
    ],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          message: "Validation failed",
          errors: formattedErrors,
        });
      },
    }),
  );

  app.useGlobalInterceptors(new LanguageInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Culinary Ethos API")
    .setDescription("API for Culinary Ethos application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
