import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsIn } from 'class-validator';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';

export class UpdateEstadoPromocionDto {
  @ApiProperty({
    example: 2,
    description: 'Nuevo estado de la promoción: 1 = Programada, 2 = Activa, 3 = Finalizada',
    enum: [1, 2, 3],
  })
  @IsNotEmpty({ message: 'El estado de la promoción es obligatorio' })
  @IsInt({ message: 'El estado de la promoción debe ser un número entero' })
  @IsIn(
    [
      EstadoPromocionEnum.PROGRAMADA,
      EstadoPromocionEnum.ACTIVA,
      EstadoPromocionEnum.FINALIZADA,
    ],
    {
      message: 'El estado debe ser 1 (Programada), 2 (Activa) o 3 (Finalizada)',
    }
  )
  estadoPromocionId: number;
}
