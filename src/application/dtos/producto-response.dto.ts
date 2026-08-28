import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del producto' })
  id: number;

  @ApiProperty({ example: '770100100001', description: 'Código de barras del producto' })
  codigoBarras: string;

  @ApiProperty({ example: 'Gaseosa Cola 1.5L', description: 'Nombre comercial del producto' })
  nombre: string;

  @ApiPropertyOptional({
    example: 'Bebida carbonatada 1.5L sabor original',
    description: 'Descripción detallada',
  })
  descripcion: string | null;

  @ApiProperty({ example: 5000.0, description: 'Precio de venta al público' })
  precioVenta: number;

  @ApiProperty({ example: 3200.0, description: 'Precio de costo del producto' })
  precioCosto: number;

  @ApiProperty({ example: 150.0, description: 'Stock actual disponible en inventario' })
  stockActual: number;

  @ApiProperty({ example: 1, description: 'Identificador de la categoría a la que pertenece' })
  categoriaId: number;

  @ApiProperty({ example: true, description: 'Indica si el producto se encuentra activo' })
  activo: boolean;
}
