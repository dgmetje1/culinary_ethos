import { NestFactory } from '@nestjs/core';
import fs from 'node:fs';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const httpsOptions = {
  key: fs.readFileSync('./.cert/key.pem'),
  cert: fs.readFileSync('./.cert/cert.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = new DocumentBuilder()
    .setTitle('RCP and Plan API')
    .setDescription('API for RCP and Plan application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
