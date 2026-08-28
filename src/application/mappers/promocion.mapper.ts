import { Promocion } from '../../domain/entities/promocion.entity';
import { PromocionRegla } from '../../domain/entities/promocion-regla.entity';
import {
  EstadoPromocionEnum,
  EstadoPromocionNombre,
} from '../../domain/value-objects/estado-promocion.enum';
import {
  TipoDescuentoEnum,
  TipoDescuentoNombre,
} from '../../domain/value-objects/tipo-descuento.enum';
import { CreatePromocionDto } from '../dtos/create-promocion.dto';
import {
  PromocionResponseDto,
  ProductoSimpleDto,
  CategoriaSimpleDto,
  ReglaResponseDto,
} from '../dtos/promocion-response.dto';

export class PromocionMapper {
  public static toDomain(dto: CreatePromocionDto): Promocion {
    const reglas = dto.reglas
      ? dto.reglas.map(
          (r) =>
            new PromocionRegla(
              undefined,
              undefined,
              r.diasSemana,
              r.horaInicio,
              r.horaFin,
              r.limiteUsosPorTicket
            )
        )
      : [];

    return Promocion.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      tipoDescuentoId: dto.tipoDescuentoId,
      valorDescuento: dto.valorDescuento,
      cantidadMinima: dto.cantidadMinima,
      cantidadPagada: dto.cantidadPagada,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: new Date(dto.fechaFin),
      productoIds: dto.productoIds ?? [],
      categoriaIds: dto.categoriaIds ?? [],
      reglas,
    });
  }

  public static toResponseDto(domain: Promocion): PromocionResponseDto {
    const tipoDescuentoNombre =
      TipoDescuentoNombre[domain.tipoDescuentoId as TipoDescuentoEnum] ||
      `Tipo ${domain.tipoDescuentoId}`;

    const estadoPromocionNombre =
      EstadoPromocionNombre[domain.estadoPromocionId as EstadoPromocionEnum] ||
      `Estado ${domain.estadoPromocionId}`;

    const productos: ProductoSimpleDto[] | undefined = domain.productos
      ? domain.productos.map((p) => ({
          id: p.id,
          codigoBarras: p.codigoBarras,
          nombre: p.nombre,
          precioVenta: p.precioVenta,
        }))
      : undefined;

    const categorias: CategoriaSimpleDto[] | undefined = domain.categorias
      ? domain.categorias.map((c) => ({
          id: c.id,
          nombre: c.nombre,
        }))
      : undefined;

    const reglas: ReglaResponseDto[] | undefined = domain.reglas
      ? domain.reglas.map((r) => ({
          id: r.id,
          diasSemana: r.diasSemana,
          horaInicio: r.horaInicio,
          horaFin: r.horaFin,
          limiteUsosPorTicket: r.limiteUsosPorTicket,
        }))
      : undefined;

    return {
      id: domain.id ?? 0,
      nombre: domain.nombre,
      descripcion: domain.descripcion,
      tipoDescuentoId: domain.tipoDescuentoId,
      tipoDescuentoNombre,
      valorDescuento: domain.valorDescuento,
      cantidadMinima: domain.cantidadMinima,
      cantidadPagada: domain.cantidadPagada,
      fechaInicio: domain.fechaInicio instanceof Date ? domain.fechaInicio.toISOString() : String(domain.fechaInicio),
      fechaFin: domain.fechaFin instanceof Date ? domain.fechaFin.toISOString() : String(domain.fechaFin),
      activa: domain.activa,
      estadoPromocionId: domain.estadoPromocionId,
      estadoPromocionNombre,
      productoIds: domain.productoIds,
      categoriaIds: domain.categoriaIds,
      productos,
      categorias,
      reglas,
    };
  }

  public static toListResponseDto(domains: Promocion[]): PromocionResponseDto[] {
    return domains.map((d) => this.toResponseDto(d));
  }
}
