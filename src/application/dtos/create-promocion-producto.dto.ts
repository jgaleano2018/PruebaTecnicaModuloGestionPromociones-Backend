import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePromocionProductoDto {
  @ApiProperty({ example: 1, description: 'ID de la promoción' })
  @IsNotEmpty({ message: 'El ID de la promoción es obligatorio' })
  @IsInt({ message: 'El ID de la promoción debe ser un número entero' })
  promocionId: number;

  @ApiProperty({ example: 1, description: 'ID del producto a asociar' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productoId: number;
}
