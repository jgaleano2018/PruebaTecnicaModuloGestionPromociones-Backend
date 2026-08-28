import { TipoDescuento } from '../../domain/entities/tipo-descuento.entity';
import { TipoDescuentoResponseDto } from '../dtos/tipo-descuento-response.dto';

export class TipoDescuentoMapper {
  public static toResponseDto(domain: TipoDescuento): TipoDescuentoResponseDto {
    return {
      id: domain.id,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      activo: domain.activo,
    };
  }

  public static toListResponseDto(domains: TipoDescuento[]): TipoDescuentoResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
