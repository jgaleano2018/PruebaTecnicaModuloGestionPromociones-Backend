import { Repository, In } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../../../../domain/entities/categoria.entity';
import { CategoriaRepositoryInterface } from '../../../../domain/repositories/categoria.repository.interface';
import { AppDataSource } from '../data-source';
import { CategoriaOrmEntity } from '../entities/categoria.orm-entity';

export class TypeOrmCategoriaRepository implements CategoriaRepositoryInterface {
  private get repository(): Repository<CategoriaOrmEntity> {
    return AppDataSource.getRepository(CategoriaOrmEntity);
  }

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
