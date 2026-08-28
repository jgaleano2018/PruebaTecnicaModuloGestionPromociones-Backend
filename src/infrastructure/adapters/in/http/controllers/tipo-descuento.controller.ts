import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { TipoDescuentoResponseDto } from '../../../../../application/dtos/tipo-descuento-response.dto';
import { ListTipoDescuentoUseCase } from '../../../../../application/use-cases/list-tipo-descuento.use-case';

@ApiTags('Tipos de Descuento')
@Controller('tipos-descuento')
export class TipoDescuentoController {
  constructor(private readonly listTipoDescuentoUseCase: ListTipoDescuentoUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los tipos de descuento',
    description:
      'Retorna el catálogo de tipos de descuento disponibles (ej: Porcentaje, Monto Fijo) activos para la creación de promociones.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de tipos de descuento obtenida exitosamente',
    type: [TipoDescuentoResponseDto],
  })
  public findAll(): Observable<TipoDescuentoResponseDto[]> {
    return this.listTipoDescuentoUseCase.execute();
  }
}
