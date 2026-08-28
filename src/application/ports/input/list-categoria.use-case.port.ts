import { Observable } from 'rxjs';
import { CategoriaResponseDto } from '../../dtos/categoria-response.dto';

export interface ListCategoriaUseCasePort {
  execute(): Observable<CategoriaResponseDto[]>;
}
