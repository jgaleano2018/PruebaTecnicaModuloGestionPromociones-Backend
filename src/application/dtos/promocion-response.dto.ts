import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReglaResponseDto {
  @ApiPropertyOptional({ example: 1 })
  id?: number;

  @ApiPropertyOptional({ example: 'LUN,MAR,MIE' })
  diasSemana?: string | null;

  @ApiPropertyOptional({ example: '08:00:00' })
  horaInicio?: string | null;

  @ApiPropertyOptional({ example: '20:00:00' })
  horaFin?: string | null;

  @ApiPropertyOptional({ example: 3 })
  limiteUsosPorTicket?: number | null;
}

export class ProductoSimpleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '770100100001' })
  codigoBarras: string;

  @ApiProperty({ example: 'Gaseosa Cola 1.5L' })
  nombre: string;

  @ApiProperty({ example: 5000 })
  precioVenta: number;
}

export class CategoriaSimpleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Bebidas' })
  nombre: string;
}

export class PromocionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Descuento Verano 2026' })
  nombre: string;

  @ApiPropertyOptional({ example: '20% de descuento en categoría Bebidas' })
  descripcion: string | null;

  @ApiProperty({ example: 1 })
  tipoDescuentoId: number;

  @ApiProperty({ example: 'Porcentaje' })
  tipoDescuentoNombre: string;

  @ApiProperty({ example: 20 })
  valorDescuento: number;

  @ApiPropertyOptional({ example: 1 })
  cantidadMinima: number | null;

  @ApiPropertyOptional({ example: 1 })
  cantidadPagada: number | null;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z' })
  fechaInicio: string;

  @ApiProperty({ example: '2026-08-31T23:59:59.000Z' })
  fechaFin: string;

  @ApiProperty({ example: true })
  activa: boolean;

  @ApiProperty({ example: 2 })
  estadoPromocionId: number;

  @ApiProperty({ example: 'Activa' })
  estadoPromocionNombre: string;

  @ApiProperty({ example: [1, 2], type: [Number] })
  productoIds: number[];

  @ApiProperty({ example: [1], type: [Number] })
  categoriaIds: number[];

  @ApiPropertyOptional({ type: [ProductoSimpleDto] })
  productos?: ProductoSimpleDto[];

  @ApiPropertyOptional({ type: [CategoriaSimpleDto] })
  categorias?: CategoriaSimpleDto[];

  @ApiPropertyOptional({ type: [ReglaResponseDto] })
  reglas?: ReglaResponseDto[];
}
