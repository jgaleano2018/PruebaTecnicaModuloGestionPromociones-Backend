import { ApiProperty } from '@nestjs/swagger';

export class PromocionCategoriaResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la promoción' })
  promocionId: number;

  @ApiProperty({ example: 2, description: 'ID de la categoría asociada' })
  categoriaId: number;
}
