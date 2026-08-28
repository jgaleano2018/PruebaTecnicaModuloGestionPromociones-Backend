import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadoPromocion } from '../../../../../../domain/entities/estado-promocion.entity';
import { EstadoPromocionRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { EstadoPromocionOrmEntity } from '../../../../../persistence/typeorm/entities/estado-promocion.orm-entity';

@Injectable()
export class TypeOrmEstadoPromocionAdapter implements EstadoPromocionRepositoryPort {
  constructor(
    @InjectRepository(EstadoPromocionOrmEntity)
    private readonly repository: Repository<EstadoPromocionOrmEntity>
  ) {}

  public findAll(): Observable<EstadoPromocion[]> {
    return from(
      this.repository.find({
        where: { activo: true },
        order: { id: 'ASC' },
      })
    ).pipe(
      map((entities) =>
        entities.map((e) => new EstadoPromocion(e.id, e.nombre, e.descripcion, e.activo))
      )
    );
  }

  public findById(id: number): Observable<EstadoPromocion | null> {
    return from(this.repository.findOne({ where: { id } })).pipe(
      map((entity) =>
        entity ? new EstadoPromocion(entity.id, entity.nombre, entity.descripcion, entity.activo) : null
      )
    );
  }
}
