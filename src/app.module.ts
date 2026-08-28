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
        const rawPort = configService.get<string>('DB_PORT');
        const port = rawPort ? parseInt(rawPort, 10) : 1433;

        const dbUser =
          configService.get<string>('DB_USER') ||
          configService.get<string>('DB_USERNAME') ||
          'sa';

        const dbPassword = configService.get<string>('DB_PASSWORD');

        return {
          type: 'mssql',
          host: configService.get<string>('DB_HOST', 'sqlserver'),
          port: isNaN(port) ? 1433 : port,
          username: dbUser,
          password: dbPassword,
          database: configService.get<string>('DB_NAME', 'PromocionesDB'),
          synchronize: String(configService.get('DB_SYNCHRONIZE', 'true')) === 'true',
          logging: String(configService.get('DB_LOGGING', 'false')) === 'true',
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
            encrypt: String(configService.get('DB_ENCRYPT', 'false')) === 'true',
            trustServerCertificate:
              String(configService.get('DB_TRUST_SERVER_CERTIFICATE', 'true')) !== 'false',
            enableArithAbort: true,
          },
          extra: {
            trustServerCertificate:
              String(configService.get('DB_TRUST_SERVER_CERTIFICATE', 'true')) !== 'false',
          },
        };
      },
    }),
    PromocionesModule,
  ],
})
export class AppModule {}