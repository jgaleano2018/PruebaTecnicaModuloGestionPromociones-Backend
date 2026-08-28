import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoDescuento } from '../../../../../../domain/entities/tipo-descuento.entity';
import { TipoDescuentoRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { TipoDescuentoOrmEntity } from '../../../../../persistence/typeorm/entities/tipo-descuento.orm-entity';

@Injectable()
export class TypeOrmTipoDescuentoAdapter implements TipoDescuentoRepositoryPort {
  constructor(
    @InjectRepository(TipoDescuentoOrmEntity)
    private readonly repository: Repository<TipoDescuentoOrmEntity>
  ) {}

  public findAll(): Observable<TipoDescuento[]> {
    return from(
      this.repository.find({
        where: { activo: true },
        order: { id: 'ASC' },
      })
    ).pipe(
      map((entities) =>
        entities.map((e) => new TipoDescuento(e.id, e.nombre, e.descripcion, e.activo))
      )
    );
  }

  public findById(id: number): Observable<TipoDescuento | null> {
    return from(this.repository.findOne({ where: { id } })).pipe(
      map((entity) =>
        entity ? new TipoDescuento(entity.id, entity.nombre, entity.descripcion, entity.activo) : null
      )
    );
  }
}
