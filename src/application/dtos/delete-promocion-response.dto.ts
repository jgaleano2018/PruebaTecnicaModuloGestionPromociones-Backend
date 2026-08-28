import { ApiProperty } from '@nestjs/swagger';

export class DeletePromocionResponseDto {
  @ApiProperty({ example: true, description: 'Indica si la operación de eliminación fue exitosa' })
  success: boolean;

  @ApiProperty({ example: 'Promoción con ID 1 eliminada exitosamente.', description: 'Mensaje de confirmación de la eliminación' })
  message: string;
}
