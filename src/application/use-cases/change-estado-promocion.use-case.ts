import { Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromotionNotFoundException } from '../../domain/exceptions/domain.exception';
import { UpdateEstadoPromocionDto } from '../dtos/update-estado-promocion.dto';
import { PromocionResponseDto } from '../dtos/promocion-response.dto';
import { PromocionMapper } from '../mappers/promocion.mapper';

export class ChangeEstadoPromocionUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(id: number, dto: UpdateEstadoPromocionDto): Observable<PromocionResponseDto> {
    return this.promocionRepository.findById(id).pipe(
      switchMap((promocion) => {
        if (!promocion) {
          return throwError(() => new PromotionNotFoundException(id));
        }

        // Domain method with business rules
        promocion.cambiarEstado(dto.estadoPromocionId);

        return this.promocionRepository.update(promocion);
      }),
      map((updatedPromocion) => PromocionMapper.toResponseDto(updatedPromocion))
    );
  }
}
