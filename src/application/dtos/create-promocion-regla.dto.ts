import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePromocionReglaDto {
  @ApiProperty({ example: 1, description: 'ID de la promoción a la cual se asocia la regla' })
  @IsNotEmpty({ message: 'El ID de la promoción es obligatorio' })
  @IsInt({ message: 'El ID de la promoción debe ser un número entero' })
  promocionId: number;

  @ApiPropertyOptional({
    example: 'LUN,MAR,MIE,JUE,VIE',
    description: 'Días de la semana en los que aplica la regla (ej: LUN,MAR,MIE,JUE,VIE,SAB,DOM)',
  })
  @IsOptional()
  @IsString({ message: 'Los días de la semana deben ser una cadena de texto' })
  diasSemana?: string;

  @ApiPropertyOptional({
    example: '08:00:00',
    description: 'Hora de inicio de vigencia de la regla (formato HH:mm:ss o HH:mm)',
  })
  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  horaInicio?: string;

  @ApiPropertyOptional({
    example: '20:00:00',
    description: 'Hora de finalización de vigencia de la regla (formato HH:mm:ss o HH:mm)',
  })
  @IsOptional()
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  horaFin?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Límite máximo de usos permitidos por ticket de compra',
  })
  @IsOptional()
  @IsInt({ message: 'El límite de usos debe ser un número entero' })
  @Min(1, { message: 'El límite de usos por ticket debe ser mayor a 0' })
  limiteUsosPorTicket?: number;
}
