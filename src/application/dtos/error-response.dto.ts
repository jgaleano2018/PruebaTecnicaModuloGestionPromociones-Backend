import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código de estado HTTP del error' })
  statusCode: number;

  @ApiProperty({ example: 'BusinessRuleValidationException', description: 'Nombre de la excepción o tipo de error' })
  error: string;

  @ApiProperty({
    example: 'La fecha de fin debe ser posterior a la fecha de inicio.',
    description: 'Mensaje descriptivo del error o regla de negocio violada',
  })
  message: string;

  @ApiProperty({ example: '2026-08-27T23:45:00.000Z', description: 'Fecha y hora UTC en la que ocurrió el error' })
  timestamp: string;

  @ApiProperty({ example: '/api/v1/promociones', description: 'Ruta del endpoint solicitado' })
  path: string;

  @ApiPropertyOptional({
    example: ['El nombre de la promoción es obligatorio'],
    description: 'Detalles adicionales de validación en caso de aplicar',
  })
  details?: any;
}
