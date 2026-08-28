import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreatePromocionReglaDto } from '../../../../../application/dtos/create-promocion-regla.dto';
import { PromocionReglaResponseDto } from '../../../../../application/dtos/promocion-regla-response.dto';
import { CreatePromocionReglaUseCase } from '../../../../../application/use-cases/create-promocion-regla.use-case';

@ApiTags('Reglas de Promoción')
@Controller('promocion-reglas')
export class PromocionReglaController {
  constructor(private readonly createPromocionReglaUseCase: CreatePromocionReglaUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una regla de promoción',
    description:
      'Asocia una nueva regla de horario, días de semana o límite de usos a una promoción existente que no esté en estado Finalizada.',
  })
  @ApiBody({ type: CreatePromocionReglaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Regla de promoción creada exitosamente',
    type: PromocionReglaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en la validación del DTO de entrada',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró la promoción indicada',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'La promoción se encuentra en estado Finalizada y no puede modificarse',
  })
  public create(@Body() dto: CreatePromocionReglaDto): Observable<PromocionReglaResponseDto> {
    return this.createPromocionReglaUseCase.execute(dto);
  }
}
