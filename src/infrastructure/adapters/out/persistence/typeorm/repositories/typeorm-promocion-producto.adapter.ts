import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionProducto } from '../../../../../../domain/entities/promocion-producto.entity';
import { PromocionProductoRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { PromocionProductoOrmEntity } from '../../../../../persistence/typeorm/entities/promocion-producto.orm-entity';

@Injectable()
export class TypeOrmPromocionProductoAdapter implements PromocionProductoRepositoryPort {
  constructor(
    @InjectRepository(PromocionProductoOrmEntity)
    private readonly repository: Repository<PromocionProductoOrmEntity>
  ) {}

  public create(promocionProducto: PromocionProducto): Observable<PromocionProducto> {
    const savePromise = async (): Promise<PromocionProducto> => {
      const orm = new PromocionProductoOrmEntity();
      orm.promocionId = promocionProducto.promocionId;
      orm.productoId = promocionProducto.productoId;

      const saved = await this.repository.save(orm);
      return new PromocionProducto(saved.promocionId, saved.productoId);
    };

    return from(savePromise());
  }

  public findByPromocionId(promocionId: number): Observable<PromocionProducto[]> {
    return from(this.repository.find({ where: { promocionId } })).pipe(
      map((entities) =>
        entities.map((e) => new PromocionProducto(e.promocionId, e.productoId))
      )
    );
  }

  public exists(promocionId: number, productoId: number): Observable<boolean> {
    return from(this.repository.count({ where: { promocionId, productoId } })).pipe(
      map((count) => count > 0)
    );
  }

  public delete(promocionId: number, productoId: number): Observable<boolean> {
    return from(this.repository.delete({ promocionId, productoId })).pipe(
      map((result) => (result.affected ?? 0) > 0)
    );
  }
}
