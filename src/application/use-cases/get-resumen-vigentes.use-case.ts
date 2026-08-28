import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { BusinessRuleValidationException } from '../../domain/exceptions/domain.exception';
import { QueryVigenciaDto } from '../dtos/query-vigencia.dto';
import { ResumenVigenciaDto } from '../dtos/promocion-resumen-vigencia.dto';
import { PromocionMapper } from '../mappers/promocion.mapper';

export class GetResumenVigentesUseCase {
  constructor(private readonly promocionRepository: PromocionRepositoryInterface) {}

  public execute(query: QueryVigenciaDto): Observable<ResumenVigenciaDto> {
    const inicio = new Date(query.fechaInicio);
    const fin = new Date(query.fechaFin);

    if (isNaN(inicio.getTime())) {
      return throwError(
        () => new BusinessRuleValidationException('La fechaInicio ingresada no es válida.')
      );
    }

    if (isNaN(fin.getTime())) {
      return throwError(
        () => new BusinessRuleValidationException('La fechaFin ingresada no es válida.')
      );
    }

    if (fin.getTime() < inicio.getTime()) {
      return throwError(
        () =>
          new BusinessRuleValidationException(
            'La fechaFin debe ser igual o posterior a la fechaInicio en la consulta de vigencia.'
          )
      );
    }

    const fechaActual = new Date();

    return this.promocionRepository.countVigentes(inicio, fin, fechaActual).pipe(
      map((resumen) => ({
        totalVigentes: resumen.totalVigentes,
        fechaInicioFiltro: resumen.fechaInicioFiltro,
        fechaFinFiltro: resumen.fechaFinFiltro,
        promociones: resumen.promociones.map((p) => PromocionMapper.toResponseDto(p)),
      }))
    );
  }
}
