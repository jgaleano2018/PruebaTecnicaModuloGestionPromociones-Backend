import { Observable } from 'rxjs';
import { PromocionResponseDto } from '../../dtos/promocion-response.dto';

export interface ListPromocionesUseCasePort {
  execute(): Observable<PromocionResponseDto[]>;
}
