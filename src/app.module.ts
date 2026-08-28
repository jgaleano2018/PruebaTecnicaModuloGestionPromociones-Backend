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

    host: envConfig.database.host,
    port: envConfig.database.port,

    username: envConfig.database.username,
    password: envConfig.database.password,
    database: envConfig.database.database,

    synchronize: envConfig.database.synchronize,
    logging: envConfig.database.logging,

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
