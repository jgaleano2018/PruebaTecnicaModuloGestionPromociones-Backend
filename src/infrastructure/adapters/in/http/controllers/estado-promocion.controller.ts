import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EstadoPromocionResponseDto } from '../../../../../application/dtos/estado-promocion-response.dto';
import { ListEstadoPromocionUseCase } from '../../../../../application/use-cases/list-estado-promocion.use-case';

@ApiTags('Estados de Promoción')
@Controller('estados-promocion')
export class EstadoPromocionController {
  constructor(private readonly listEstadoPromocionUseCase: ListEstadoPromocionUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los estados de promoción',
    description:
      'Retorna el catálogo completo de estados de promoción disponibles (Programada, Activa, Finalizada).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de estados de promoción obtenida exitosamente',
    type: [EstadoPromocionResponseDto],
  })
  public findAll(): Observable<EstadoPromocionResponseDto[]> {
    return this.listEstadoPromocionUseCase.execute();
  }
}
