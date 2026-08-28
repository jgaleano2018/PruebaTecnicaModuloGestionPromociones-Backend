import { Observable } from 'rxjs';
import { CreatePromocionDto } from '../../dtos/create-promocion.dto';
import { PromocionResponseDto } from '../../dtos/promocion-response.dto';

export interface CreatePromocionUseCasePort {
  execute(dto: CreatePromocionDto): Observable<PromocionResponseDto>;
}
