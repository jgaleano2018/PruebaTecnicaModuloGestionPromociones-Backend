import { Observable } from 'rxjs';
import { ProductoResponseDto } from '../../dtos/producto-response.dto';

export interface ListProductoUseCasePort {
  execute(): Observable<ProductoResponseDto[]>;
}
