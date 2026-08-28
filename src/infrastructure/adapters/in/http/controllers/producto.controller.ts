import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ProductoResponseDto } from '../../../../../application/dtos/producto-response.dto';
import { ListProductoUseCase } from '../../../../../application/use-cases/list-producto.use-case';

@ApiTags('Productos')
@Controller('productos')
export class ProductoController {
  constructor(private readonly listProductoUseCase: ListProductoUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los productos',
    description:
      'Retorna el catálogo de productos comerciales activos registrados en el sistema con precios, inventario y categoría.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos obtenida exitosamente',
    type: [ProductoResponseDto],
  })
  public findAll(): Observable<ProductoResponseDto[]> {
    return this.listProductoUseCase.execute();
  }
}
