import { ApiProperty } from '@nestjs/swagger';
import { PromocionResponseDto } from './promocion-response.dto';

export class ResumenVigenciaDto {
  @ApiProperty({ example: 2, description: 'Número total de promociones vigentes hoy dentro del rango' })
  totalVigentes: number;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z', description: 'Fecha inicio de filtro' })
  fechaInicioFiltro: string;

  @ApiProperty({ example: '2026-08-31T23:59:59.000Z', description: 'Fecha fin de filtro' })
  fechaFinFiltro: string;

  @ApiProperty({ type: [PromocionResponseDto], description: 'Lista de promociones vigentes' })
  promociones: PromocionResponseDto[];
}
