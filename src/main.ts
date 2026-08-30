import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { envConfig } from './infrastructure/config/env.config';
import { DomainExceptionFilter } from './infrastructure/adapters/in/http/filters/domain-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // ============================================================
  // CORS
  // ============================================================

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin Origin:
      // curl, Postman, aplicaciones móviles, health checks, etc.
      if (!origin) {
        return callback(null, true);
      }

      // En desarrollo, permitir todos los orígenes
      if (envConfig.nodeEnv !== 'production') {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      const isAllowed = envConfig.corsOrigins.some(
        (allowed) => allowed.replace(/\/$/, '') === normalizedOrigin,
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(
          new Error(`Origin no permitido por CORS: ${origin}`),
          false,
        );
      }
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
    ],

    credentials: true,

    preflightContinue: false,

    optionsSuccessStatus: 204,
  });

  // ============================================================
  // API PREFIX
  // ============================================================

  const apiPrefix = envConfig.apiPrefix.replace(/^\//, '');

  app.setGlobalPrefix(apiPrefix);

  // ============================================================
  // VALIDATION
  // ============================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,

      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============================================================
  // EXCEPTION FILTERS
  // ============================================================

  app.useGlobalFilters(
    new DomainExceptionFilter(),
  );

  // ============================================================
  // SWAGGER
  // ============================================================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Gestión de Promociones')
    .setDescription(
      'API REST para el módulo de Gestión de Promociones con NestJS, TypeORM, SQL Server y Arquitectura Hexagonal.',
    )
    .setVersion('1.0.0')

    .addTag(
      'Promociones',
      'Operaciones y reglas de negocio para promociones',
    )

    .addTag(
      'Promoción Productos',
      'Asociación de productos comerciales a promociones',
    )

    .addTag(
      'Promoción Categorías',
      'Asociación de categorías a promociones',
    )

    .addTag(
      'Reglas de Promoción',
      'Gestión de reglas de promoción',
    )

    .addTag(
      'Productos',
      'Catálogo y consulta de productos',
    )

    .addTag(
      'Categorías',
      'Catálogo y consulta de categorías',
    )

    .addTag(
      'Tipos de Descuento',
      'Catálogo de tipos de descuento',
    )

    .addTag(
      'Estados de Promoción',
      'Catálogo de estados de promoción',
    )

    .addTag(
      'Health',
      'Estado operativo de la API y SQL Server',
    )

    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup(
    'api-docs',
    app,
    document,
    {
      customSiteTitle: 'Documentación API Promociones',
    },
  );

  SwaggerModule.setup(
    'docs',
    app,
    document,
  );

  // ============================================================
  // START SERVER
  // ============================================================

  const port = envConfig.port || 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(
    `🚀 Servidor NestJS corriendo en http://0.0.0.0:${port}/${apiPrefix}`,
  );

  logger.log(
    `📖 Swagger: http://localhost:${port}/api-docs`,
  );

  logger.log(
    `🩺 Health: http://localhost:${port}/${apiPrefix}/health`,
  );
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');

  logger.error(
    '❌ Error fatal iniciando NestJS',
    error instanceof Error ? error.stack : error,
  );

  process.exit(1);
});
