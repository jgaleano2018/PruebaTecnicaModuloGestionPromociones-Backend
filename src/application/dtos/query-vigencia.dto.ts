import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class QueryVigenciaDto {
  @ApiProperty({
    example: '2026-08-01T00:00:00.000Z',
    description: 'Fecha inicial del rango de consulta',
  })
  @IsNotEmpty({ message: 'El parámetro fechaInicio es obligatorio' })
  @IsDateString({}, { message: 'fechaInicio debe tener un formato de fecha válido (YYYY-MM-DD o ISO)' })
  fechaInicio: string;

  @ApiProperty({
    example: '2026-08-31T23:59:59.000Z',
    description: 'Fecha final del rango de consulta',
  })
  @IsNotEmpty({ message: 'El parámetro fechaFin es obligatorio' })
  @IsDateString({}, { message: 'fechaFin debe tener un formato de fecha válido (YYYY-MM-DD o ISO)' })
  fechaFin: string;
}
