import { ApiProperty } from '@nestjs/swagger';

export class ResumenConteoEstadosDto {
  @ApiProperty({ example: 3, description: 'Promociones en estado Programada' })
  programada: number;

  @ApiProperty({ example: 5, description: 'Promociones en estado Activa' })
  activa: number;

  @ApiProperty({ example: 12, description: 'Promociones en estado Finalizada' })
  finalizada: number;

  @ApiProperty({ example: 20, description: 'Total de promociones' })
  total: number;
}
