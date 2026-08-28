import { Observable } from 'rxjs';
import { UpdateEstadoPromocionDto } from '../../dtos/update-estado-promocion.dto';
import { PromocionResponseDto } from '../../dtos/promocion-response.dto';

export interface ChangeEstadoPromocionUseCasePort {
  execute(id: number, dto: UpdateEstadoPromocionDto): Observable<PromocionResponseDto>;
}
