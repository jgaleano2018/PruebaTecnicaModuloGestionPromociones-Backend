import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromocionResponseDto } from '../dtos/promocion-response.dto';
import { PromocionMapper } from '../mappers/promocion.mapper';

export class ListPromocionesUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(): Observable<PromocionResponseDto[]> {
    return this.promocionRepository
      .findAll()
      .pipe(map((promociones) => PromocionMapper.toListResponseDto(promociones)));
  }
}
