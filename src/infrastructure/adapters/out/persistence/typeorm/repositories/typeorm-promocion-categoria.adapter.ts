import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionCategoria } from '../../../../../../domain/entities/promocion-categoria.entity';
import { PromocionCategoriaRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { PromocionCategoriaOrmEntity } from '../../../../../persistence/typeorm/entities/promocion-categoria.orm-entity';

@Injectable()
export class TypeOrmPromocionCategoriaAdapter implements PromocionCategoriaRepositoryPort {
  constructor(
    @InjectRepository(PromocionCategoriaOrmEntity)
    private readonly repository: Repository<PromocionCategoriaOrmEntity>
  ) {}

  public create(promocionCategoria: PromocionCategoria): Observable<PromocionCategoria> {
    const savePromise = async (): Promise<PromocionCategoria> => {
      const orm = new PromocionCategoriaOrmEntity();
      orm.promocionId = promocionCategoria.promocionId;
      orm.categoriaId = promocionCategoria.categoriaId;

      const saved = await this.repository.save(orm);
      return new PromocionCategoria(saved.promocionId, saved.categoriaId);
    };

    return from(savePromise());
  }

  public findByPromocionId(promocionId: number): Observable<PromocionCategoria[]> {
    return from(this.repository.find({ where: { promocionId } })).pipe(
      map((entities) =>
        entities.map((e) => new PromocionCategoria(e.promocionId, e.categoriaId))
      )
    );
  }

  public exists(promocionId: number, categoriaId: number): Observable<boolean> {
    return from(this.repository.count({ where: { promocionId, categoriaId } })).pipe(
      map((count) => count > 0)
    );
  }

  public delete(promocionId: number, categoriaId: number): Observable<boolean> {
    return from(this.repository.delete({ promocionId, categoriaId })).pipe(
      map((result) => (result.affected ?? 0) > 0)
    );
  }
}
