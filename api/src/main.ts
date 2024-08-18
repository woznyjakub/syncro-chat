import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { getConfig, setupEnv, validateEnv } from '@config/config';
import { LoggerService } from '@logger/services/logger.service';

async function bootstrap(): Promise<void> {
  setupEnv();
  validateEnv(process.env);

  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  const prefix = '/api';
  app.setGlobalPrefix(prefix);

  app.enableCors({
    origin: ['http://localhost'],
    methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    credentials: true,
    maxAge: 600,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest.js + React.js Monorepo rich starter')
    .setDescription('Main backend API description')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  const { port } = getConfig();

  await app.listen(port, '0.0.0.0');
}
void bootstrap();
