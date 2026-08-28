import { Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromotionNotFoundException } from '../../domain/exceptions/domain.exception';
import { DeletePromocionResponseDto } from '../dtos/delete-promocion-response.dto';

export class DeletePromocionUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(id: number): Observable<DeletePromocionResponseDto> {
    return this.promocionRepository.findById(id).pipe(
      switchMap((promocion) => {
        if (!promocion) {
          return throwError(() => new PromotionNotFoundException(id));
        }

        // Validate domain deletion rule: only if Programada
        promocion.validarParaEliminacion();

        return this.promocionRepository.delete(id);
      }),
      map(() => ({
        success: true,
        message: `Promoción con ID ${id} eliminada exitosamente.`,
      }))
    );
  }
}
