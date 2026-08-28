import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CategoriaResponseDto } from '../../../../../application/dtos/categoria-response.dto';
import { ListCategoriaUseCase } from '../../../../../application/use-cases/list-categoria.use-case';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly listCategoriaUseCase: ListCategoriaUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las categorías',
    description:
      'Retorna el catálogo de categorías activas registradas en el sistema para asociar a promociones.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de categorías obtenida exitosamente',
    type: [CategoriaResponseDto],
  })
  public findAll(): Observable<CategoriaResponseDto[]> {
    return this.listCategoriaUseCase.execute();
  }
}
