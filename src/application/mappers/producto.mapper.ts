import { Producto } from '../../domain/entities/producto.entity';
import { ProductoResponseDto } from '../dtos/producto-response.dto';

export class ProductoMapper {
  public static toResponseDto(domain: Producto): ProductoResponseDto {
    return {
      id: domain.id,
      codigoBarras: domain.codigoBarras,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      precioVenta: domain.precioVenta,
      precioCosto: domain.precioCosto,
      stockActual: domain.stockActual,
      categoriaId: domain.categoriaId,
      activo: domain.activo,
    };
  }

  public static toListResponseDto(domains: Producto[]): ProductoResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
