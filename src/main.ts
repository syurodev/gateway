import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as os from 'os';
import * as dotenv from 'dotenv';
import {
  HttpException,
  HttpStatus,
  LogLevel,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
const envConfig = dotenv.parse(fs.readFileSync('.env'));

async function bootstrap() {
  process.env.uv_threadpool_size = os.cpus().length.toString();
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new HttpException(
          Object.values(validationErrors[0].constraints)[0],
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // const config = new DocumentBuilder()
  //   .setTitle('')
  //   .setDescription('')
  //   .setVersion('2.2222')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.SERVICE_PORT, '0.0.0.0');
}
bootstrap();
