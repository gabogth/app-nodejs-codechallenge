import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ConfigEnv } from './domain/core/configEnv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(ConfigEnv.STAGE == "PRD" ? 3001 : 3081);
}
bootstrap();
