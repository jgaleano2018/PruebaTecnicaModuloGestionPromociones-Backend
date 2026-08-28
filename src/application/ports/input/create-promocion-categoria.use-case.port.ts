import { Observable } from 'rxjs';
import { CreatePromocionCategoriaDto } from '../../dtos/create-promocion-categoria.dto';
import { PromocionCategoriaResponseDto } from '../../dtos/promocion-categoria-response.dto';

export interface CreatePromocionCategoriaUseCasePort {
  execute(dto: CreatePromocionCategoriaDto): Observable<PromocionCategoriaResponseDto>;
}
