import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PromocionesModule } from './promociones.module';

import { CategoriaOrmEntity } from './infrastructure/persistence/typeorm/entities/categoria.orm-entity';
import { ProductoOrmEntity } from './infrastructure/persistence/typeorm/entities/producto.orm-entity';
import { TipoDescuentoOrmEntity } from './infrastructure/persistence/typeorm/entities/tipo-descuento.orm-entity';
import { EstadoPromocionOrmEntity } from './infrastructure/persistence/typeorm/entities/estado-promocion.orm-entity';
import { PromocionOrmEntity } from './infrastructure/persistence/typeorm/entities/promocion.orm-entity';
import { PromocionProductoOrmEntity } from './infrastructure/persistence/typeorm/entities/promocion-producto.orm-entity';
import { PromocionCategoriaOrmEntity } from './infrastructure/persistence/typeorm/entities/promocion-categoria.orm-entity';
import { PromocionReglaOrmEntity } from './infrastructure/persistence/typeorm/entities/promocion-regla.orm-entity';
import { VentaOrmEntity } from './infrastructure/persistence/typeorm/entities/venta.orm-entity';
import { DetalleVentaOrmEntity } from './infrastructure/persistence/typeorm/entities/detalle-venta.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const host =
          configService.get<string>('DB_HOST') || 'sqlserver';

        const port = Number(
          configService.get<string>('DB_PORT') || '1433',
        );

        const username =
          configService.get<string>('DB_USER') || 'sa';

        const password =
          configService.get<string>('DB_PASSWORD');

        const database =
          configService.get<string>('DB_NAME') ||
          'PromocionesDB';

        const synchronize =
          (
            configService.get<string>(
              'DB_SYNCHRONIZE',
              'false',
            )
          ).toLowerCase() === 'true';

        const logging =
          (
            configService.get<string>(
              'DB_LOGGING',
              'false',
            )
          ).toLowerCase() === 'true';

        const encrypt =
          (
            configService.get<string>(
              'DB_ENCRYPT',
              'false',
            )
          ).toLowerCase() === 'true';

        const trustServerCertificate =
          (
            configService.get<string>(
              'DB_TRUST_SERVER_CERTIFICATE',
              'true',
            )
          ).toLowerCase() !== 'false';

        return {
          type: 'mssql' as const,

          host,

          port: Number.isNaN(port)
            ? 1433
            : port,

          username,
          password,
          database,

          synchronize,
          logging,

          retryAttempts: 20,
          retryDelay: 3000,
          verboseRetryLog: true,

          entities: [
            CategoriaOrmEntity,
            ProductoOrmEntity,
            TipoDescuentoOrmEntity,
            EstadoPromocionOrmEntity,
            PromocionOrmEntity,
            PromocionProductoOrmEntity,
            PromocionCategoriaOrmEntity,
            PromocionReglaOrmEntity,
            VentaOrmEntity,
            DetalleVentaOrmEntity,
          ],

          options: {
            encrypt,
            trustServerCertificate,
            enableArithAbort: true,
          },
        };
      },
    }),

    PromocionesModule,
  ],
})
export class AppModule {}