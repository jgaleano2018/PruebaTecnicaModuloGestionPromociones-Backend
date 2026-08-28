import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReglaPromocionDto {
  @ApiPropertyOptional({ example: 'LUN,MAR,MIE,JUE,VIE', description: 'Días de la semana aplicables' })
  @IsOptional()
  @IsString()
  diasSemana?: string;

  @ApiPropertyOptional({ example: '08:00:00', description: 'Hora de inicio aplicable' })
  @IsOptional()
  @IsString()
  horaInicio?: string;

  @ApiPropertyOptional({ example: '20:00:00', description: 'Hora de fin aplicable' })
  @IsOptional()
  @IsString()
  horaFin?: string;

  @ApiPropertyOptional({ example: 3, description: 'Límite de usos permitidos por ticket' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limiteUsosPorTicket?: number;
}

export class CreatePromocionDto {
  @ApiProperty({ example: 'Descuento Verano 2026', description: 'Nombre de la promoción' })
  @IsNotEmpty({ message: 'El nombre de la promoción es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiPropertyOptional({
    example: '20% de descuento en categoría Bebidas',
    description: 'Descripción detallada',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 1,
    description: '1 = Porcentaje, 2 = Monto Fijo',
  })
  @IsNotEmpty({ message: 'El tipo de descuento es obligatorio' })
  @IsInt({ message: 'El tipo de descuento debe ser un número entero' })
  tipoDescuentoId: number;

  @ApiProperty({
    example: 20,
    description: 'Valor del descuento (1 - 100 si es porcentaje)',
  })
  @IsNotEmpty({ message: 'El valor de descuento es obligatorio' })
  @IsNumber({}, { message: 'El valor de descuento debe ser numérico' })
  @Min(0.01, { message: 'El valor de descuento debe ser mayor a 0' })
  valorDescuento: number;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad mínima requerida' })
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadMinima?: number;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad pagada en caso de ofertas NxM' })
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadPagada?: number;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z', description: 'Fecha de inicio' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO válido' })
  fechaInicio: string;

  @ApiProperty({ example: '2026-08-31T23:59:59.000Z', description: 'Fecha de finalización' })
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato ISO válido' })
  fechaFin: string;

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2],
    description: 'Arreglo de IDs de productos asociados',
  })
  @IsOptional()
  @IsArray({ message: 'Los productos deben ser un arreglo de IDs' })
  @IsInt({ each: true, message: 'Cada producto ID debe ser un número entero' })
  productoIds?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Arreglo de IDs de categorías asociadas',
  })
  @IsOptional()
  @IsArray({ message: 'Las categorías deben ser un arreglo de IDs' })
  @IsInt({ each: true, message: 'Cada categoría ID debe ser un número entero' })
  categoriaIds?: number[];

  @ApiPropertyOptional({
    type: [ReglaPromocionDto],
    description: 'Reglas de aplicación horarias y por día',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReglaPromocionDto)
  reglas?: ReglaPromocionDto[];
}
