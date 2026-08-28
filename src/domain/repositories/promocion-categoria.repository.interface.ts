import { Observable } from 'rxjs';
import { PromocionCategoria } from '../entities/promocion-categoria.entity';

export interface PromocionCategoriaRepositoryInterface {
  create(promocionCategoria: PromocionCategoria): Observable<PromocionCategoria>;
  findByPromocionId(promocionId: number): Observable<PromocionCategoria[]>;
  exists(promocionId: number, categoriaId: number): Observable<boolean>;
  delete(promocionId: number, categoriaId: number): Observable<boolean>;
}
