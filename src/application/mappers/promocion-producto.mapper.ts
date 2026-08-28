import { PromocionProducto } from '../../domain/entities/promocion-producto.entity';
import { CreatePromocionProductoDto } from '../dtos/create-promocion-producto.dto';
import { PromocionProductoResponseDto } from '../dtos/promocion-producto-response.dto';

export class PromocionProductoMapper {
  public static toDomain(dto: CreatePromocionProductoDto): PromocionProducto {
    return new PromocionProducto(dto.promocionId, dto.productoId);
  }

  public static toResponseDto(domain: PromocionProducto): PromocionProductoResponseDto {
    return {
      promocionId: domain.promocionId,
      productoId: domain.productoId,
    };
  }

  public static toListResponseDto(domains: PromocionProducto[]): PromocionProductoResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
