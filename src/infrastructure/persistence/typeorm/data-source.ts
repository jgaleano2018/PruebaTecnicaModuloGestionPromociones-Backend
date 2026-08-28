import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envConfig } from '../../config/env.config';
import { CategoriaOrmEntity } from './entities/categoria.orm-entity';
import { ProductoOrmEntity } from './entities/producto.orm-entity';
import { TipoDescuentoOrmEntity } from './entities/tipo-descuento.orm-entity';
import { EstadoPromocionOrmEntity } from './entities/estado-promocion.orm-entity';
import { PromocionOrmEntity } from './entities/promocion.orm-entity';
import { PromocionProductoOrmEntity } from './entities/promocion-producto.orm-entity';
import { PromocionCategoriaOrmEntity } from './entities/promocion-categoria.orm-entity';
import { PromocionReglaOrmEntity } from './entities/promocion-regla.orm-entity';
import { VentaOrmEntity } from './entities/venta.orm-entity';
import { DetalleVentaOrmEntity } from './entities/detalle-venta.orm-entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: envConfig.database.host,
  ...(envConfig.database.instanceName ? {} : { port: envConfig.database.port }),
  username: envConfig.database.username,
  password: envConfig.database.password,
  database: envConfig.database.database,
  ...(envConfig.database.domain ? { domain: envConfig.database.domain } : {}),
  ...(envConfig.database.useWindowsAuth
    ? {
        domain: envConfig.database.domain,
        authentication: {
          type: 'ntlm' as const,
          options: {
            domain: envConfig.database.domain,
            userName: envConfig.database.username,
            password: envConfig.database.password,
          },
        },
      }
    : {}),
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
    ...(envConfig.database.instanceName
      ? { instanceName: envConfig.database.instanceName }
      : {}),
    encrypt: envConfig.database.encrypt,
    trustServerCertificate: envConfig.database.trustServerCertificate,
    enableArithAbort: true,
  },
  extra: {
    validateConnection: false,
    trustServerCertificate: envConfig.database.trustServerCertificate,
    ...(envConfig.database.useWindowsAuth ? { trustedConnection: true } : {}),
  },
});
