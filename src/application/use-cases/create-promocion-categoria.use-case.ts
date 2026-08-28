import { Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionCategoriaRepositoryInterface } from '../../domain/repositories/promocion-categoria.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { CategoriaRepositoryInterface } from '../../domain/repositories/categoria.repository.interface';
import {
  PromotionNotFoundException,
  BusinessRuleValidationException,
} from '../../domain/exceptions/domain.exception';
import { CreatePromocionCategoriaDto } from '../dtos/create-promocion-categoria.dto';
import { PromocionCategoriaResponseDto } from '../dtos/promocion-categoria-response.dto';
import { PromocionCategoriaMapper } from '../mappers/promocion-categoria.mapper';
import { CreatePromocionCategoriaUseCasePort } from '../ports/input/create-promocion-categoria.use-case.port';

export class CreatePromocionCategoriaUseCase implements CreatePromocionCategoriaUseCasePort {
  constructor(
    private readonly promocionCategoriaRepository: PromocionCategoriaRepositoryInterface,
    private readonly promocionRepository: PromocionRepositoryInterface,
    private readonly categoriaRepository: CategoriaRepositoryInterface
  ) {}

  public execute(dto: CreatePromocionCategoriaDto): Observable<PromocionCategoriaResponseDto> {
    return this.promocionRepository.findById(dto.promocionId).pipe(
      switchMap((promocion) => {
        if (!promocion) {
          return throwError(() => new PromotionNotFoundException(dto.promocionId));
        }

        // Valida que la promoción no se encuentre en estado Finalizada
        promocion.validarModificacion();

        return this.categoriaRepository.findByIds([dto.categoriaId]).pipe(
          switchMap((categorias) => {
            if (!categorias || categorias.length === 0) {
              return throwError(
                () =>
                  new BusinessRuleValidationException(
                    `No se encontró la categoría con ID: ${dto.categoriaId}`
                  )
              );
            }

            return this.promocionCategoriaRepository.exists(dto.promocionId, dto.categoriaId).pipe(
              switchMap((alreadyExists) => {
                if (alreadyExists) {
                  return throwError(
                    () =>
                      new BusinessRuleValidationException(
                        `La categoría con ID ${dto.categoriaId} ya está asociada a la promoción ${dto.promocionId}.`
                      )
                  );
                }

                const entity = PromocionCategoriaMapper.toDomain(dto);
                return this.promocionCategoriaRepository.create(entity);
              })
            );
          })
        );
      }),
      map((saved) => PromocionCategoriaMapper.toResponseDto(saved))
    );
  }
}
