import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoDescuentoRepositoryInterface } from '../../domain/repositories/tipo-descuento.repository.interface';
import { TipoDescuentoResponseDto } from '../dtos/tipo-descuento-response.dto';
import { TipoDescuentoMapper } from '../mappers/tipo-descuento.mapper';
import { ListTipoDescuentoUseCasePort } from '../ports/input/list-tipo-descuento.use-case.port';

export class ListTipoDescuentoUseCase implements ListTipoDescuentoUseCasePort {
  constructor(private readonly tipoDescuentoRepository: TipoDescuentoRepositoryInterface) {}

  public execute(): Observable<TipoDescuentoResponseDto[]> {
    return this.tipoDescuentoRepository
      .findAll()
      .pipe(map((tipos) => TipoDescuentoMapper.toListResponseDto(tipos)));
  }
}
