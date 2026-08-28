import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadoPromocionRepositoryInterface } from '../../domain/repositories/estado-promocion.repository.interface';
import { EstadoPromocionResponseDto } from '../dtos/estado-promocion-response.dto';
import { EstadoPromocionMapper } from '../mappers/estado-promocion.mapper';
import { ListEstadoPromocionUseCasePort } from '../ports/input/list-estado-promocion.use-case.port';

export class ListEstadoPromocionUseCase implements ListEstadoPromocionUseCasePort {
  constructor(private readonly estadoPromocionRepository: EstadoPromocionRepositoryInterface) {}

  public execute(): Observable<EstadoPromocionResponseDto[]> {
    return this.estadoPromocionRepository
      .findAll()
      .pipe(map((estados) => EstadoPromocionMapper.toListResponseDto(estados)));
  }
}
