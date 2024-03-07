import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yaml';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const file = await readFile('./doc/api.yaml', 'utf8');
  const swaggerDocument = YAML.parse(file);
  swaggerUi.setup(swaggerDocument);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(process.env.PORT);
}

bootstrap();
