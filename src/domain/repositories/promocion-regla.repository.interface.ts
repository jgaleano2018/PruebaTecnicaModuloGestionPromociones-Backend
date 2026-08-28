import { Observable } from 'rxjs';
import { PromocionRegla } from '../entities/promocion-regla.entity';

export interface PromocionReglaRepositoryInterface {
  create(regla: PromocionRegla): Observable<PromocionRegla>;
  findByPromocionId(promocionId: number): Observable<PromocionRegla[]>;
  findById(id: number): Observable<PromocionRegla | null>;
  delete(id: number): Observable<boolean>;
}
