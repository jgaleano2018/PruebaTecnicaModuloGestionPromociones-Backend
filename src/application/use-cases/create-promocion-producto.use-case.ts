import { Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionProductoRepositoryInterface } from '../../domain/repositories/promocion-producto.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { ProductoRepositoryInterface } from '../../domain/repositories/producto.repository.interface';
import {
  PromotionNotFoundException,
  BusinessRuleValidationException,
} from '../../domain/exceptions/domain.exception';
import { CreatePromocionProductoDto } from '../dtos/create-promocion-producto.dto';
import { PromocionProductoResponseDto } from '../dtos/promocion-producto-response.dto';
import { PromocionProductoMapper } from '../mappers/promocion-producto.mapper';
import { CreatePromocionProductoUseCasePort } from '../ports/input/create-promocion-producto.use-case.port';

export class CreatePromocionProductoUseCase implements CreatePromocionProductoUseCasePort {
  constructor(
    private readonly promocionProductoRepository: PromocionProductoRepositoryInterface,
    private readonly promocionRepository: PromocionRepositoryInterface,
    private readonly productoRepository: ProductoRepositoryInterface
  ) {}

  public execute(dto: CreatePromocionProductoDto): Observable<PromocionProductoResponseDto> {
    return this.promocionRepository.findById(dto.promocionId).pipe(
      switchMap((promocion) => {
        if (!promocion) {
          return throwError(() => new PromotionNotFoundException(dto.promocionId));
        }

        // Valida que la promoción no esté en estado Finalizada (inmutable)
        promocion.validarModificacion();

        return this.productoRepository.findByIds([dto.productoId]).pipe(
          switchMap((productos) => {
            if (!productos || productos.length === 0) {
              return throwError(
                () =>
                  new BusinessRuleValidationException(
                    `No se encontró el producto con ID: ${dto.productoId}`
                  )
              );
            }

            return this.promocionProductoRepository.exists(dto.promocionId, dto.productoId).pipe(
              switchMap((alreadyExists) => {
                if (alreadyExists) {
                  return throwError(
                    () =>
                      new BusinessRuleValidationException(
                        `El producto con ID ${dto.productoId} ya está asociado a la promoción ${dto.promocionId}.`
                      )
                  );
                }

                const entity = PromocionProductoMapper.toDomain(dto);
                return this.promocionProductoRepository.create(entity);
              })
            );
          })
        );
      }),
      map((saved) => PromocionProductoMapper.toResponseDto(saved))
    );
  }
}
