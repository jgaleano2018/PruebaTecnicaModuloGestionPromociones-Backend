import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envConfig } from './infrastructure/config/env.config';
import { DomainExceptionFilter } from './infrastructure/adapters/in/http/filters/domain-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefixes and middlewares
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      const isAllowed = envConfig.corsOrigins.some(
        (allowed) => allowed.replace(/\/$/, '') === normalizedOrigin
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow or specific configuration
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });
  app.setGlobalPrefix(envConfig.apiPrefix.replace(/^\//, ''));

  // Global Validation Pipe (DTO enforcement)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global Exception Filters (Domain to HTTP mapping)
  app.useGlobalFilters(new DomainExceptionFilter());

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Gestión de Promociones')
    .setDescription(
      'Documentación interactiva Swagger OpenAPI 3.0 para el módulo de Gestión de Promociones con NestJS, TypeORM, Arquitectura Hexagonal y Programación Reactiva (RxJS).'
    )
    .setVersion('1.0.0')
    .addTag('Promociones', 'Operaciones y reglas de negocio para promociones')
    .addTag('Promoción Productos', 'Asociación de productos comerciales a promociones')
    .addTag('Promoción Categorías', 'Asociación de categorías a promociones')
    .addTag('Reglas de Promoción', 'Gestión y creación de reglas horarias y por día para promociones')
    .addTag('Productos', 'Catálogo y consulta de productos comerciales')
    .addTag('Categorías', 'Catálogo y consulta de categorías de productos')
    .addTag('Tipos de Descuento', 'Catálogo y consulta de tipos de descuento')
    .addTag('Estados de Promoción', 'Catálogo y consulta de estados de promoción')
    .addTag('Health', 'Estado operativo y verificación de base de datos')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Documentación API Promociones',
  });
  SwaggerModule.setup('docs', app, document);

  const port = envConfig.port || 3000;
  await app.listen(port);

  logger.log(`🚀 Servidor NestJS corriendo en http://localhost:${port}/${envConfig.apiPrefix.replace(/^\//, '')}`);
  logger.log(`📖 Documentación Swagger UI en http://localhost:${port}/api-docs`);
  logger.log(`🩺 Health Check endpoint en http://localhost:${port}/${envConfig.apiPrefix.replace(/^\//, '')}/health`);
}

bootstrap();
