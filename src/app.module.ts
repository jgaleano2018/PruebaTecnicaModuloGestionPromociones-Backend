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
      useFactory: () => {
        // Importante: Revisa envConfig o process.env dentro de la fábrica
        const host = process.env.DB_HOST || 'localhost';
        const port = Number(process.env.DB_PORT) || 1433;
        const username = process.env.DB_USERNAME || 'sa';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME || 'test';

        return {
          type: 'mssql',
          host,
          port,
          username,
          password,
          database,
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV === 'development',
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
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: true,
            enableArithAbort: true,
          },
          extra: {
            validateConnection: false,
            trustServerCertificate: true,
          },
        };
      },
    }),
    PromocionesModule,
  ],
})
export class AppModule {}