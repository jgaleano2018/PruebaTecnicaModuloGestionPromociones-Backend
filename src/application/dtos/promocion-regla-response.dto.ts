import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromocionReglaResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único de la regla' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID de la promoción asociada' })
  promocionId: number;

  @ApiPropertyOptional({
    example: 'LUN,MAR,MIE,JUE,VIE',
    description: 'Días de la semana aplicables',
  })
  diasSemana: string | null;

  @ApiPropertyOptional({ example: '08:00:00', description: 'Hora de inicio aplicable' })
  horaInicio: string | null;

  @ApiPropertyOptional({ example: '20:00:00', description: 'Hora de fin aplicable' })
  horaFin: string | null;

  @ApiPropertyOptional({ example: 3, description: 'Límite de usos permitidos por ticket' })
  limiteUsosPorTicket: number | null;
}
