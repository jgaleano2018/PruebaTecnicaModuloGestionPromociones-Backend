import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../../../../../../domain/entities/categoria.entity';
import { CategoriaRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { CategoriaOrmEntity } from '../../../../../persistence/typeorm/entities/categoria.orm-entity';

@Injectable()
export class TypeOrmCategoriaAdapter implements CategoriaRepositoryPort {
  constructor(
    @InjectRepository(CategoriaOrmEntity)
    private readonly repository: Repository<CategoriaOrmEntity>
  ) {}

  public findAll(): Observable<Categoria[]> {
    return from(this.repository.find({ where: { activo: true } })).pipe(
      map((entities) =>
        entities.map((e) => new Categoria(e.id, e.nombre, e.descripcion, e.activo))
      )
    );
  }

  public findByIds(ids: number[]): Observable<Categoria[]> {
    if (ids.length === 0) return from(Promise.resolve([]));
    return from(this.repository.findBy({ id: In(ids) })).pipe(
      map((entities) =>
        entities.map((e) => new Categoria(e.id, e.nombre, e.descripcion, e.activo))
      )
    );
  }
}
