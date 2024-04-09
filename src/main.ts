import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yaml';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionFilter } from './filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docFile = await readFile('./doc/api.yaml', 'utf8');
  const swaggerDocument = YAML.parse(docFile);
  swaggerUi.setup(swaggerDocument);
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(LoggingService));

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
