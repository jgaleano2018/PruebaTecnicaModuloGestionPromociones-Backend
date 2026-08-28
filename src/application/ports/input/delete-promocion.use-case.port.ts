import { Observable } from 'rxjs';
import { DeletePromocionResponseDto } from '../../use-cases/delete-promocion.use-case';

export interface DeletePromocionUseCasePort {
  execute(id: number): Observable<DeletePromocionResponseDto>;
}
