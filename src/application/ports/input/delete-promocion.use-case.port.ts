import { Observable } from 'rxjs';
import { DeletePromocionResponseDto } from '../../dtos/delete-promocion-response.dto';

export interface DeletePromocionUseCasePort {
  execute(id: number): Observable<DeletePromocionResponseDto>;
}
