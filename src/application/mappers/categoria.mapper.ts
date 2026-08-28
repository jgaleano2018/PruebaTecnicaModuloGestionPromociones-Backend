import { Categoria } from '../../domain/entities/categoria.entity';
import { CategoriaResponseDto } from '../dtos/categoria-response.dto';

export class CategoriaMapper {
  public static toResponseDto(domain: Categoria): CategoriaResponseDto {
    return {
      id: domain.id,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      activo: domain.activo,
    };
  }

  public static toListResponseDto(domains: Categoria[]): CategoriaResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
