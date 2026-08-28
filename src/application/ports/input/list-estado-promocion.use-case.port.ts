import { Observable } from 'rxjs';
import { EstadoPromocionResponseDto } from '../../dtos/estado-promocion-response.dto';

export interface ListEstadoPromocionUseCasePort {
  execute(): Observable<EstadoPromocionResponseDto[]>;
}
