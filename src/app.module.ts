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
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST', 'sqlserver'),
        port: Number(configService.get<number>('DB_PORT', 1433)),
        // Se añade fallback entre DB_USER (usado en tu docker-compose) y DB_USERNAME
        username: configService.get<string>('DB_USER') || configService.get<string>('DB_USERNAME') || 'sa',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_NAME', 'PromocionesDB'),
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
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
          encrypt: configService.get<string>('DB_ENCRYPT') === 'true',
          trustServerCertificate: configService.get<string>('DB_TRUST_SERVER_CERTIFICATE') !== 'false',
          enableArithAbort: true,
        },
        extra: {
          validateConnection: false,
          trustServerCertificate: configService.get<string>('DB_TRUST_SERVER_CERTIFICATE') !== 'false',
        },
      }),
    }),
    PromocionesModule,
  ],
})
export class AppModule {}