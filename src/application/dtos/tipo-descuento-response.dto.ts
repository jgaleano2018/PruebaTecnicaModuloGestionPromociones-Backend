import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TipoDescuentoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del tipo de descuento' })
  id: number;

  @ApiProperty({ example: 'Porcentaje', description: 'Nombre del tipo de descuento' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Descuento %', description: 'Descripción detallada' })
  descripcion: string | null;

  @ApiProperty({ example: true, description: 'Estado activo/inactivo' })
  activo: boolean;
}
