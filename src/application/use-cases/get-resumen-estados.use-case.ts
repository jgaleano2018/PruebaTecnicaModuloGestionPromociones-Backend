import { Observable } from 'rxjs';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { ResumenConteoEstadosDto } from '../dtos/promocion-resumen-estado.dto';

export class GetResumenEstadosUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(): Observable<ResumenConteoEstadosDto> {
    return this.promocionRepository.countByEstado();
  }
}
