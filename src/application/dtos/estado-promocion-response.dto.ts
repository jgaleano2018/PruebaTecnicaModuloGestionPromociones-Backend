import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstadoPromocionResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del estado de la promoción' })
  id: number;

  @ApiProperty({ example: 'Programada', description: 'Nombre del estado' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Promoción aún no vigente', description: 'Descripción detallada del estado' })
  descripcion: string | null;

  @ApiProperty({ example: true, description: 'Indica si el estado está activo en el sistema' })
  activo: boolean;
}
