import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreatePromocionProductoDto } from '../../../../../application/dtos/create-promocion-producto.dto';
import { PromocionProductoResponseDto } from '../../../../../application/dtos/promocion-producto-response.dto';
import { ErrorResponseDto } from '../../../../../application/dtos/error-response.dto';
import { CreatePromocionProductoUseCase } from '../../../../../application/use-cases/create-promocion-producto.use-case';

@ApiTags('Promoción Productos')
@Controller('promocion-productos')
export class PromocionProductoController {
  constructor(
    private readonly createPromocionProductoUseCase: CreatePromocionProductoUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Asociar un producto a una promoción',
    description:
      'Crea el vínculo en la tabla `promocion_productos` entre una promoción existente y un producto comercial válido, asegurando que la promoción no esté Finalizada.',
  })
  @ApiBody({ type: CreatePromocionProductoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto asociado a la promoción exitosamente',
    type: PromocionProductoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error de validación o el producto ya está asociado a la promoción',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró la promoción o producto indicado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'La promoción se encuentra en estado Finalizada y no puede modificarse',
    type: ErrorResponseDto,
  })
  public create(
    @Body() dto: CreatePromocionProductoDto
  ): Observable<PromocionProductoResponseDto> {
    return this.createPromocionProductoUseCase.execute(dto);
  }
}
