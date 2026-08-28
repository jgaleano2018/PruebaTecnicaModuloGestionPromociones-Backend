import { Observable } from 'rxjs';
import { TipoDescuentoResponseDto } from '../../dtos/tipo-descuento-response.dto';

export interface ListTipoDescuentoUseCasePort {
  execute(): Observable<TipoDescuentoResponseDto[]>;
}
