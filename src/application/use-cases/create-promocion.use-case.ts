import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { CreatePromocionDto } from '../dtos/create-promocion.dto';
import { PromocionResponseDto } from '../dtos/promocion-response.dto';
import { PromocionMapper } from '../mappers/promocion.mapper';

export class CreatePromocionUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(dto: CreatePromocionDto): Observable<PromocionResponseDto> {
    const promocion = PromocionMapper.toDomain(dto);
    return this.promocionRepository
      .create(promocion)
      .pipe(map((createdPromocion) => PromocionMapper.toResponseDto(createdPromocion)));
  }
}
