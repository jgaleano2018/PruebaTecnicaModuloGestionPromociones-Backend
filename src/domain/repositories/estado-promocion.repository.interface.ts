import { Observable } from 'rxjs';
import { EstadoPromocion } from '../entities/estado-promocion.entity';

export interface EstadoPromocionRepositoryInterface {
  findAll(): Observable<EstadoPromocion[]>;
  findById(id: number): Observable<EstadoPromocion | null>;
}
