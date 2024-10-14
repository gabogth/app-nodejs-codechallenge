import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ConfigEnv } from './domain/core/configEnv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('API Yape')
    .setDescription('Documentación de la API para la gestión de transacciones')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, options));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ConfigEnv.STAGE == "PRD" ? 3000 : 3080);
}
bootstrap();
