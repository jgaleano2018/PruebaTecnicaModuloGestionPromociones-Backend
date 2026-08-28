import { Observable } from 'rxjs';
import { QueryVigenciaDto } from '../../dtos/query-vigencia.dto';
import { ResumenVigenciaDto } from '../../dtos/promocion-resumen-vigencia.dto';

export interface GetResumenVigentesUseCasePort {
  execute(query: QueryVigenciaDto): Observable<ResumenVigenciaDto>;
}
