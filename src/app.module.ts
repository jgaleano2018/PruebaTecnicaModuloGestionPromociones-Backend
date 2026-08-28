import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './infrastructure/config/env.config';
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
    TypeOrmModule.forRoot({
    type: 'mssql',

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    synchronize: process.env.NODE_ENV === 'development',
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
        encrypt: envConfig.database.encrypt,
        trustServerCertificate:
        envConfig.database.trustServerCertificate,
        enableArithAbort: true,
    },
    }),
    PromocionesModule,
  ],
})
export class AppModule {}
