import { Observable } from 'rxjs';
import { PromocionProducto } from '../entities/promocion-producto.entity';

export interface PromocionProductoRepositoryInterface {
  create(promocionProducto: PromocionProducto): Observable<PromocionProducto>;
  findByPromocionId(promocionId: number): Observable<PromocionProducto[]>;
  exists(promocionId: number, productoId: number): Observable<boolean>;
  delete(promocionId: number, productoId: number): Observable<boolean>;
}
