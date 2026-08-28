import { PromocionCategoria } from '../../domain/entities/promocion-categoria.entity';
import { CreatePromocionCategoriaDto } from '../dtos/create-promocion-categoria.dto';
import { PromocionCategoriaResponseDto } from '../dtos/promocion-categoria-response.dto';

export class PromocionCategoriaMapper {
  public static toDomain(dto: CreatePromocionCategoriaDto): PromocionCategoria {
    return new PromocionCategoria(dto.promocionId, dto.categoriaId);
  }

  public static toResponseDto(domain: PromocionCategoria): PromocionCategoriaResponseDto {
    return {
      promocionId: domain.promocionId,
      categoriaId: domain.categoriaId,
    };
  }

  public static toListResponseDto(domains: PromocionCategoria[]): PromocionCategoriaResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
