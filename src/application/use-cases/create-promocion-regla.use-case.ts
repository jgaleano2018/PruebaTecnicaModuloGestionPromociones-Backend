import { Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionReglaRepositoryInterface } from '../../domain/repositories/promocion-regla.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromotionNotFoundException } from '../../domain/exceptions/domain.exception';
import { CreatePromocionReglaDto } from '../dtos/create-promocion-regla.dto';
import { PromocionReglaResponseDto } from '../dtos/promocion-regla-response.dto';
import { PromocionReglaMapper } from '../mappers/promocion-regla.mapper';
import { CreatePromocionReglaUseCasePort } from '../ports/input/create-promocion-regla.use-case.port';

export class CreatePromocionReglaUseCase implements CreatePromocionReglaUseCasePort {
  constructor(
    private readonly promocionReglaRepository: PromocionReglaRepositoryInterface,
    private readonly promocionRepository: PromocionRepositoryInterface
  ) {}

  public execute(dto: CreatePromocionReglaDto): Observable<PromocionReglaResponseDto> {
    return this.promocionRepository.findById(dto.promocionId).pipe(
      switchMap((promocion) => {
        if (!promocion) {
          return throwError(() => new PromotionNotFoundException(dto.promocionId));
        }

        // Valida que la promoción no esté en estado Finalizada
        promocion.validarModificacion();

        const regla = PromocionReglaMapper.toDomain(dto);
        return this.promocionReglaRepository.create(regla);
      }),
      map((savedRegla) => PromocionReglaMapper.toResponseDto(savedRegla))
    );
  }
}
