import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoriaResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único de la categoría' })
  id: number;

  @ApiProperty({ example: 'Bebidas', description: 'Nombre de la categoría' })
  nombre: string;

  @ApiPropertyOptional({
    example: 'Bebidas frías, jugos y refrescos',
    description: 'Descripción detallada de la categoría',
  })
  descripcion: string | null;

  @ApiProperty({ example: true, description: 'Indica si la categoría está activa' })
  activo: boolean;
}
