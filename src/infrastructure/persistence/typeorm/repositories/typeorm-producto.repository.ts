import { Repository, In } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../../../../domain/entities/producto.entity';
import { ProductoRepositoryInterface } from '../../../../domain/repositories/producto.repository.interface';
import { AppDataSource } from '../data-source';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';

export class TypeOrmProductoRepository implements ProductoRepositoryInterface {
  private get repository(): Repository<ProductoOrmEntity> {
    return AppDataSource.getRepository(ProductoOrmEntity);
  }

  public findAll(): Observable<Producto[]> {
    return from(this.repository.find({ where: { activo: true } })).pipe(
      map((entities) =>
        entities.map(
          (e) =>
            new Producto(
              e.id,
              e.codigoBarras,
              e.nombre,
              e.descripcion,
              Number(e.precioVenta),
              Number(e.precioCosto),
              Number(e.stockActual),
              e.categoriaId,
              e.activo
            )
        )
      )
    );
  }

  public findByIds(ids: number[]): Observable<Producto[]> {
    if (ids.length === 0) return from(Promise.resolve([]));
    return from(this.repository.findBy({ id: In(ids) })).pipe(
      map((entities) =>
        entities.map(
          (e) =>
            new Producto(
              e.id,
              e.codigoBarras,
              e.nombre,
              e.descripcion,
              Number(e.precioVenta),
              Number(e.precioCosto),
              Number(e.stockActual),
              e.categoriaId,
              e.activo
            )
        )
      )
    );
  }
}
