import { Observable } from 'rxjs';
import { CreatePromocionProductoDto } from '../../dtos/create-promocion-producto.dto';
import { PromocionProductoResponseDto } from '../../dtos/promocion-producto-response.dto';

export interface CreatePromocionProductoUseCasePort {
  execute(dto: CreatePromocionProductoDto): Observable<PromocionProductoResponseDto>;
}
