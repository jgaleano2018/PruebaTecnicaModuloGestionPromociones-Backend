import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePromocionCategoriaDto {
  @ApiProperty({ example: 1, description: 'ID de la promoción' })
  @IsNotEmpty({ message: 'El ID de la promoción es obligatorio' })
  @IsInt({ message: 'El ID de la promoción debe ser un número entero' })
  promocionId: number;

  @ApiProperty({ example: 2, description: 'ID de la categoría a asociar' })
  @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  categoriaId: number;
}
