import { Observable } from 'rxjs';
import { CreatePromocionReglaDto } from '../../dtos/create-promocion-regla.dto';
import { PromocionReglaResponseDto } from '../../dtos/promocion-regla-response.dto';

export interface CreatePromocionReglaUseCasePort {
  execute(dto: CreatePromocionReglaDto): Observable<PromocionReglaResponseDto>;
}
