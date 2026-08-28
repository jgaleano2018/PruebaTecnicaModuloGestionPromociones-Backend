import { Observable } from 'rxjs';
import { ResumenConteoEstadosDto } from '../../dtos/promocion-resumen-estado.dto';

export interface GetResumenEstadosUseCasePort {
  execute(): Observable<ResumenConteoEstadosDto>;
}
