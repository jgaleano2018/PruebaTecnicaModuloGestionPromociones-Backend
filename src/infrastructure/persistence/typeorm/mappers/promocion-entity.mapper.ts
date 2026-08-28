import { Promocion } from '../../../../domain/entities/promocion.entity';
import { PromocionRegla } from '../../../../domain/entities/promocion-regla.entity';
import { Producto } from '../../../../domain/entities/producto.entity';
import { Categoria } from '../../../../domain/entities/categoria.entity';
import { PromocionOrmEntity } from '../entities/promocion.orm-entity';
import { PromocionProductoOrmEntity } from '../entities/promocion-producto.orm-entity';
import { PromocionCategoriaOrmEntity } from '../entities/promocion-categoria.orm-entity';
import { PromocionReglaOrmEntity } from '../entities/promocion-regla.orm-entity';

export class PromocionEntityMapper {
  public static toDomain(ormEntity: PromocionOrmEntity): Promocion {
    const productoIds = ormEntity.promocionProductos
      ? ormEntity.promocionProductos.map((pp) => pp.productoId)
      : [];

    const categoriaIds = ormEntity.promocionCategorias
      ? ormEntity.promocionCategorias.map((pc) => pc.categoriaId)
      : [];

    const reglas = ormEntity.reglas
      ? ormEntity.reglas.map(
          (r) =>
            new PromocionRegla(
              r.id,
              r.promocionId,
              r.diasSemana,
              r.horaInicio,
              r.horaFin,
              r.limiteUsosPorTicket
            )
        )
      : [];

    const productos = ormEntity.promocionProductos
      ? ormEntity.promocionProductos
          .filter((pp) => pp.producto !== undefined && pp.producto !== null)
          .map(
            (pp) =>
              new Producto(
                pp.producto.id,
                pp.producto.codigoBarras,
                pp.producto.nombre,
                pp.producto.descripcion,
                Number(pp.producto.precioVenta),
                Number(pp.producto.precioCosto),
                Number(pp.producto.stockActual),
                pp.producto.categoriaId,
                Boolean(pp.producto.activo)
              )
          )
      : undefined;

    const categorias = ormEntity.promocionCategorias
      ? ormEntity.promocionCategorias
          .filter((pc) => pc.categoria !== undefined && pc.categoria !== null)
          .map(
            (pc) =>
              new Categoria(
                pc.categoria.id,
                pc.categoria.nombre,
                pc.categoria.descripcion,
                Boolean(pc.categoria.activo)
              )
          )
      : undefined;

    return new Promocion({
      id: ormEntity.id,
      nombre: ormEntity.nombre,
      descripcion: ormEntity.descripcion,
      tipoDescuentoId: ormEntity.tipoDescuentoId,
      valorDescuento: Number(ormEntity.valorDescuento),
      cantidadMinima: ormEntity.cantidadMinima,
      cantidadPagada: ormEntity.cantidadPagada,
      fechaInicio: ormEntity.fechaInicio,
      fechaFin: ormEntity.fechaFin,
      activa: Boolean(ormEntity.activa),
      estadoPromocionId: ormEntity.estadoPromocionId,
      productoIds,
      categoriaIds,
      reglas,
      productos,
      categorias,
    });
  }

  public static toOrmEntity(domain: Promocion): PromocionOrmEntity {
    const orm = new PromocionOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.nombre = domain.nombre;
    orm.descripcion = domain.descripcion;
    orm.tipoDescuentoId = domain.tipoDescuentoId;
    orm.valorDescuento = domain.valorDescuento;
    orm.cantidadMinima = domain.cantidadMinima;
    orm.cantidadPagada = domain.cantidadPagada;
    orm.fechaInicio = domain.fechaInicio;
    orm.fechaFin = domain.fechaFin;
    orm.activa = domain.activa;
    orm.estadoPromocionId = domain.estadoPromocionId;

    if (domain.productoIds && domain.productoIds.length > 0) {
      orm.promocionProductos = domain.productoIds.map((pId) => {
        const pp = new PromocionProductoOrmEntity();
        if (domain.id) pp.promocionId = domain.id;
        pp.productoId = pId;
        return pp;
      });
    }

    if (domain.categoriaIds && domain.categoriaIds.length > 0) {
      orm.promocionCategorias = domain.categoriaIds.map((cId) => {
        const pc = new PromocionCategoriaOrmEntity();
        if (domain.id) pc.promocionId = domain.id;
        pc.categoriaId = cId;
        return pc;
      });
    }

    if (domain.reglas && domain.reglas.length > 0) {
      orm.reglas = domain.reglas.map((r) => {
        const pr = new PromocionReglaOrmEntity();
        if (r.id) pr.id = r.id;
        if (domain.id) pr.promocionId = domain.id;
        pr.diasSemana = r.diasSemana ?? null;
        pr.horaInicio = r.horaInicio ?? null;
        pr.horaFin = r.horaFin ?? null;
        pr.limiteUsosPorTicket = r.limiteUsosPorTicket ?? null;
        return pr;
      });
    }

    return orm;
  }
}
