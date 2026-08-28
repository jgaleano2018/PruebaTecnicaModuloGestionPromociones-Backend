import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreatePromocionCategoriaDto } from '../../../../../application/dtos/create-promocion-categoria.dto';
import { PromocionCategoriaResponseDto } from '../../../../../application/dtos/promocion-categoria-response.dto';
import { ErrorResponseDto } from '../../../../../application/dtos/error-response.dto';
import { CreatePromocionCategoriaUseCase } from '../../../../../application/use-cases/create-promocion-categoria.use-case';

@ApiTags('Promoción Categorías')
@Controller('promocion-categorias')
export class PromocionCategoriaController {
  constructor(
    private readonly createPromocionCategoriaUseCase: CreatePromocionCategoriaUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Asociar una categoría a una promoción',
    description:
      'Crea el vínculo en la tabla `promocion_categorias` entre una promoción existente y una categoría válida, validando que la promoción no se encuentre Finalizada.',
  })
  @ApiBody({ type: CreatePromocionCategoriaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categoría asociada a la promoción exitosamente',
    type: PromocionCategoriaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error de validación o la categoría ya está asociada a la promoción',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró la promoción o categoría indicada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'La promoción se encuentra en estado Finalizada y no puede modificarse',
    type: ErrorResponseDto,
  })
  public create(
    @Body() dto: CreatePromocionCategoriaDto
  ): Observable<PromocionCategoriaResponseDto> {
    return this.createPromocionCategoriaUseCase.execute(dto);
  }
}
