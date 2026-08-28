import { ApiProperty } from '@nestjs/swagger';

export class PromocionProductoResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la promoción' })
  promocionId: number;

  @ApiProperty({ example: 1, description: 'ID del producto asociado' })
  productoId: number;
}
