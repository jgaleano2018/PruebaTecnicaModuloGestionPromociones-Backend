import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionProducto } from '../../../../domain/entities/promocion-producto.entity';
import { PromocionProductoRepositoryInterface } from '../../../../domain/repositories/promocion-producto.repository.interface';
import { AppDataSource } from '../data-source';
import { PromocionProductoOrmEntity } from '../entities/promocion-producto.orm-entity';

export class TypeOrmPromocionProductoRepository
  implements PromocionProductoRepositoryInterface
{
  private get repository(): Repository<PromocionProductoOrmEntity> {
    return AppDataSource.getRepository(PromocionProductoOrmEntity);
  }

  public create(promocionProducto: PromocionProducto): Observable<PromocionProducto> {
    const createPromise = async (): Promise<PromocionProducto> => {
      const entity = new PromocionProductoOrmEntity();
      entity.promocionId = promocionProducto.promocionId;
      entity.productoId = promocionProducto.productoId;
      await this.repository.save(entity);
      return new PromocionProducto(entity.promocionId, entity.productoId);
    };

    return from(createPromise());
  }

  public findByPromocionId(promocionId: number): Observable<PromocionProducto[]> {
    return from(
      this.repository.find({ where: { promocionId }, order: { productoId: 'ASC' } })
    ).pipe(
      map((entities) =>
        entities.map((e) => new PromocionProducto(e.promocionId, e.productoId))
      )
    );
  }

  public exists(promocionId: number, productoId: number): Observable<boolean> {
    return from(
      this.repository.count({ where: { promocionId, productoId } })
    ).pipe(map((count) => count > 0));
  }

  public delete(promocionId: number, productoId: number): Observable<boolean> {
    const deletePromise = async (): Promise<boolean> => {
      const result = await this.repository.delete({ promocionId, productoId });
      return (result.affected ?? 0) > 0;
    };

    return from(deletePromise());
  }
}
