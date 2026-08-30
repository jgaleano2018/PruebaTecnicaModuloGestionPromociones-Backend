import { Observable, map, switchMap, from, of, forkJoin } from 'rxjs';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromocionCategoriaRepositoryInterface } from '../../domain/repositories/promocion-categoria.repository.interface';
import { PromocionCategoria } from '../../domain/entities/promocion-categoria.entity';
import { CreatePromocionDto } from '../dtos/create-promocion.dto';
import { PromocionResponseDto } from '../dtos/promocion-response.dto';
import { PromocionMapper } from '../mappers/promocion.mapper';

export class CreatePromocionUseCase {
  constructor(
    private readonly promocionRepository: PromocionRepositoryInterface,
    private readonly promocionCategoriaRepository: PromocionCategoriaRepositoryInterface
  ) {}

  public execute(dto: CreatePromocionDto): Observable<PromocionResponseDto> {
    const promocion = PromocionMapper.toDomain(dto);

    return this.promocionRepository.create(promocion).pipe(
      switchMap((createdPromocion) => {
        const promocionId = createdPromocion.id;
        const categoriaIds = dto.categoriaIds ?? [];

        if (!promocionId || categoriaIds.length === 0) {
          return of(PromocionMapper.toResponseDto(createdPromocion));
        }

        const insertPromocionCategoria$ = categoriaIds.map((categoriaId) =>
          this.promocionCategoriaRepository.create(
            new PromocionCategoria(promocionId, categoriaId)
          )
        );

        return forkJoin(insertPromocionCategoria$).pipe(
          map(() => PromocionMapper.toResponseDto(createdPromocion))
        );
      })
    );
  }
}
