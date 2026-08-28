import { EstadoPromocion } from '../../domain/entities/estado-promocion.entity';
import { EstadoPromocionResponseDto } from '../dtos/estado-promocion-response.dto';

export class EstadoPromocionMapper {
  public static toResponseDto(domain: EstadoPromocion): EstadoPromocionResponseDto {
    return {
      id: domain.id,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      activo: domain.activo,
    };
  }

  public static toListResponseDto(domains: EstadoPromocion[]): EstadoPromocionResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
