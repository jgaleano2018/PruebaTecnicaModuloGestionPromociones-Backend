import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionController } from './infrastructure/adapters/in/http/controllers/promocion.controller';
import { HealthController } from './infrastructure/adapters/in/http/controllers/health.controller';
import { TipoDescuentoController } from './infrastructure/adapters/in/http/controllers/tipo-descuento.controller';
import { EstadoPromocionController } from './infrastructure/adapters/in/http/controllers/estado-promocion.controller';
import { CategoriaController } from './infrastructure/adapters/in/http/controllers/categoria.controller';
import { ProductoController } from './infrastructure/adapters/in/http/controllers/producto.controller';
import { PromocionReglaController } from './infrastructure/adapters/in/http/controllers/promocion-regla.controller';
import { PromocionCategoriaController } from './infrastructure/adapters/in/http/controllers/promocion-categoria.controller';
import { PromocionProductoController } from './infrastructure/adapters/in/http/controllers/promocion-producto.controller';
import { CreatePromocionUseCase } from './application/use-cases/create-promocion.use-case';
import { ListPromocionesUseCase } from './application/use-cases/list-promociones.use-case';
import { ChangeEstadoPromocionUseCase } from './application/use-cases/change-estado-promocion.use-case';
import { DeletePromocionUseCase } from './application/use-cases/delete-promocion.use-case';
import { GetResumenEstadosUseCase } from './application/use-cases/get-resumen-estados.use-case';
import { GetResumenVigentesUseCase } from './application/use-cases/get-resumen-vigentes.use-case';
import { ListTipoDescuentoUseCase } from './application/use-cases/list-tipo-descuento.use-case';
import { ListEstadoPromocionUseCase } from './application/use-cases/list-estado-promocion.use-case';
import { ListCategoriaUseCase } from './application/use-cases/list-categoria.use-case';
import { ListProductoUseCase } from './application/use-cases/list-producto.use-case';
import { CreatePromocionReglaUseCase } from './application/use-cases/create-promocion-regla.use-case';
import { CreatePromocionCategoriaUseCase } from './application/use-cases/create-promocion-categoria.use-case';
import { CreatePromocionProductoUseCase } from './application/use-cases/create-promocion-producto.use-case';
import {
  PROMOCION_REPOSITORY_PORT,
  TIPO_DESCUENTO_REPOSITORY_PORT,
  ESTADO_PROMOCION_REPOSITORY_PORT,
  CATEGORIA_REPOSITORY_PORT,
  PRODUCTO_REPOSITORY_PORT,
  PROMOCION_REGLA_REPOSITORY_PORT,
  PROMOCION_CATEGORIA_REPOSITORY_PORT,
  PROMOCION_PRODUCTO_REPOSITORY_PORT,
} from './application/ports/output/promocion.repository.port';
import { TypeOrmPromocionAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-promocion.adapter';
import { TypeOrmCategoriaAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-categoria.adapter';
import { TypeOrmProductoAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-producto.adapter';
import { TypeOrmTipoDescuentoAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-tipo-descuento.adapter';
import { TypeOrmEstadoPromocionAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-estado-promocion.adapter';
import { TypeOrmPromocionReglaAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-promocion-regla.adapter';
import { TypeOrmPromocionCategoriaAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-promocion-categoria.adapter';
import { TypeOrmPromocionProductoAdapter } from './infrastructure/adapters/out/persistence/typeorm/repositories/typeorm-promocion-producto.adapter';
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
    TypeOrmModule.forFeature([
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
    ]),
  ],
  controllers: [
    PromocionController,
    HealthController,
    TipoDescuentoController,
    EstadoPromocionController,
    CategoriaController,
    ProductoController,
    PromocionReglaController,
    PromocionCategoriaController,
    PromocionProductoController,
  ],
  providers: [
    // Repositories / Outbound Adapters
    TypeOrmPromocionAdapter,
    TypeOrmCategoriaAdapter,
    TypeOrmProductoAdapter,
    TypeOrmTipoDescuentoAdapter,
    TypeOrmEstadoPromocionAdapter,
    TypeOrmPromocionReglaAdapter,
    TypeOrmPromocionCategoriaAdapter,
    TypeOrmPromocionProductoAdapter,
    {
      provide: PROMOCION_REPOSITORY_PORT,
      useClass: TypeOrmPromocionAdapter,
    },
    {
      provide: CATEGORIA_REPOSITORY_PORT,
      useClass: TypeOrmCategoriaAdapter,
    },
    {
      provide: PRODUCTO_REPOSITORY_PORT,
      useClass: TypeOrmProductoAdapter,
    },
    {
      provide: TIPO_DESCUENTO_REPOSITORY_PORT,
      useClass: TypeOrmTipoDescuentoAdapter,
    },
    {
      provide: ESTADO_PROMOCION_REPOSITORY_PORT,
      useClass: TypeOrmEstadoPromocionAdapter,
    },
    {
      provide: PROMOCION_REGLA_REPOSITORY_PORT,
      useClass: TypeOrmPromocionReglaAdapter,
    },
    {
      provide: PROMOCION_CATEGORIA_REPOSITORY_PORT,
      useClass: TypeOrmPromocionCategoriaAdapter,
    },
    {
      provide: PROMOCION_PRODUCTO_REPOSITORY_PORT,
      useClass: TypeOrmPromocionProductoAdapter,
    },
    // Use Cases (Injected with Outbound Repository Adapter)
    {
      provide: CreatePromocionUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new CreatePromocionUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: ListPromocionesUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new ListPromocionesUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: ChangeEstadoPromocionUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new ChangeEstadoPromocionUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: DeletePromocionUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new DeletePromocionUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: GetResumenEstadosUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new GetResumenEstadosUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: GetResumenVigentesUseCase,
      useFactory: (repo: TypeOrmPromocionAdapter) => new GetResumenVigentesUseCase(repo),
      inject: [TypeOrmPromocionAdapter],
    },
    {
      provide: ListTipoDescuentoUseCase,
      useFactory: (repo: TypeOrmTipoDescuentoAdapter) => new ListTipoDescuentoUseCase(repo),
      inject: [TypeOrmTipoDescuentoAdapter],
    },
    {
      provide: ListEstadoPromocionUseCase,
      useFactory: (repo: TypeOrmEstadoPromocionAdapter) => new ListEstadoPromocionUseCase(repo),
      inject: [TypeOrmEstadoPromocionAdapter],
    },
    {
      provide: ListCategoriaUseCase,
      useFactory: (repo: TypeOrmCategoriaAdapter) => new ListCategoriaUseCase(repo),
      inject: [TypeOrmCategoriaAdapter],
    },
    {
      provide: ListProductoUseCase,
      useFactory: (repo: TypeOrmProductoAdapter) => new ListProductoUseCase(repo),
      inject: [TypeOrmProductoAdapter],
    },
    {
      provide: CreatePromocionReglaUseCase,
      useFactory: (reglaRepo: TypeOrmPromocionReglaAdapter, promoRepo: TypeOrmPromocionAdapter) =>
        new CreatePromocionReglaUseCase(reglaRepo, promoRepo),
      inject: [TypeOrmPromocionReglaAdapter, TypeOrmPromocionAdapter],
    },
    {
      provide: CreatePromocionCategoriaUseCase,
      useFactory: (
        pcRepo: TypeOrmPromocionCategoriaAdapter,
        promoRepo: TypeOrmPromocionAdapter,
        catRepo: TypeOrmCategoriaAdapter
      ) => new CreatePromocionCategoriaUseCase(pcRepo, promoRepo, catRepo),
      inject: [
        TypeOrmPromocionCategoriaAdapter,
        TypeOrmPromocionAdapter,
        TypeOrmCategoriaAdapter,
      ],
    },
    {
      provide: CreatePromocionProductoUseCase,
      useFactory: (
        ppRepo: TypeOrmPromocionProductoAdapter,
        promoRepo: TypeOrmPromocionAdapter,
        prodRepo: TypeOrmProductoAdapter
      ) => new CreatePromocionProductoUseCase(ppRepo, promoRepo, prodRepo),
      inject: [
        TypeOrmPromocionProductoAdapter,
        TypeOrmPromocionAdapter,
        TypeOrmProductoAdapter,
      ],
    },
  ],
  exports: [
    PROMOCION_REPOSITORY_PORT,
    CATEGORIA_REPOSITORY_PORT,
    PRODUCTO_REPOSITORY_PORT,
    TIPO_DESCUENTO_REPOSITORY_PORT,
    ESTADO_PROMOCION_REPOSITORY_PORT,
    PROMOCION_REGLA_REPOSITORY_PORT,
    PROMOCION_CATEGORIA_REPOSITORY_PORT,
    PROMOCION_PRODUCTO_REPOSITORY_PORT,
  ],
})
export class PromocionesModule {}
