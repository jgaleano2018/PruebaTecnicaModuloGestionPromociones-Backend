import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../../../../../../domain/entities/producto.entity';
import { ProductoRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { ProductoOrmEntity } from '../../../../../persistence/typeorm/entities/producto.orm-entity';

@Injectable()
export class TypeOrmProductoAdapter implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repository: Repository<ProductoOrmEntity>
  ) {}

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
