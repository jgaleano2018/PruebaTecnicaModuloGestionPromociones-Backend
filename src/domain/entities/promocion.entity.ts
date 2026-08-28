import {
  BusinessRuleValidationException,
  InvalidPromotionStateException,
} from '../exceptions/domain.exception';
import { EstadoPromocionEnum } from '../value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../value-objects/tipo-descuento.enum';
import { PromocionRegla } from './promocion-regla.entity';
import { Producto } from './producto.entity';
import { Categoria } from './categoria.entity';

export interface PromocionProps {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  tipoDescuentoId: number;
  valorDescuento: number;
  cantidadMinima?: number | null;
  cantidadPagada?: number | null;
  fechaInicio: Date;
  fechaFin: Date;
  activa?: boolean;
  estadoPromocionId?: number;
  productoIds?: number[];
  categoriaIds?: number[];
  reglas?: PromocionRegla[];
  productos?: Producto[];
  categorias?: Categoria[];
}

export class Promocion {
  public readonly id?: number;
  public nombre: string;
  public descripcion: string | null;
  public tipoDescuentoId: number;
  public valorDescuento: number;
  public cantidadMinima: number | null;
  public cantidadPagada: number | null;
  public fechaInicio: Date;
  public fechaFin: Date;
  public activa: boolean;
  public estadoPromocionId: number;
  public productoIds: number[];
  public categoriaIds: number[];
  public reglas: PromocionRegla[];
  public productos?: Producto[];
  public categorias?: Categoria[];

  constructor(props: PromocionProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion ?? null;
    this.tipoDescuentoId = props.tipoDescuentoId;
    this.valorDescuento = props.valorDescuento;
    this.cantidadMinima = props.cantidadMinima ?? null;
    this.cantidadPagada = props.cantidadPagada ?? null;
    this.fechaInicio = props.fechaInicio instanceof Date ? props.fechaInicio : new Date(props.fechaInicio);
    this.fechaFin = props.fechaFin instanceof Date ? props.fechaFin : new Date(props.fechaFin);
    this.activa = props.activa ?? (props.estadoPromocionId === EstadoPromocionEnum.ACTIVA);
    this.estadoPromocionId = props.estadoPromocionId ?? EstadoPromocionEnum.PROGRAMADA;
    this.productoIds = props.productoIds ?? [];
    this.categoriaIds = props.categoriaIds ?? [];
    this.reglas = props.reglas ?? [];
    this.productos = props.productos;
    this.categorias = props.categorias;
  }

  /**
   * Factory method to create and validate a new Promocion
   */
  public static create(props: PromocionProps): Promocion {
    const promocion = new Promocion({
      ...props,
      estadoPromocionId: props.estadoPromocionId ?? EstadoPromocionEnum.PROGRAMADA,
      activa: props.estadoPromocionId === EstadoPromocionEnum.ACTIVA,
    });

    promocion.validate();
    return promocion;
  }

  /**
   * Validates domain business rules
   */
  public validate(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new BusinessRuleValidationException('El nombre de la promoción es obligatorio.');
    }

    if (this.valorDescuento === undefined || this.valorDescuento === null || isNaN(this.valorDescuento) || this.valorDescuento <= 0) {
      throw new BusinessRuleValidationException('El valor de descuento es obligatorio y debe ser mayor a 0.');
    }

    const hasProductos = this.productoIds && this.productoIds.length > 0;
    const hasCategorias = this.categoriaIds && this.categoriaIds.length > 0;
    if (!hasProductos && !hasCategorias) {
      throw new BusinessRuleValidationException(
        'La promoción debe estar asociada al menos a un producto o a una categoría.'
      );
    }

    if (isNaN(this.fechaInicio.getTime())) {
      throw new BusinessRuleValidationException('La fecha de inicio no es válida.');
    }

    if (isNaN(this.fechaFin.getTime())) {
      throw new BusinessRuleValidationException('La fecha de fin no es válida.');
    }

    if (this.fechaFin.getTime() <= this.fechaInicio.getTime()) {
      throw new BusinessRuleValidationException(
        'La fecha de fin debe ser posterior a la fecha de inicio.'
      );
    }

    if (this.tipoDescuentoId === TipoDescuentoEnum.PORCENTAJE) {
      if (this.valorDescuento < 1 || this.valorDescuento > 100) {
        throw new BusinessRuleValidationException(
          'Si el tipo de descuento es Porcentaje, el valor debe estar entre 1 y 100.'
        );
      }
    }
  }

  /**
   * Changes the state following the workflow: Programada -> Activa -> Finalizada
   */
  public cambiarEstado(nuevoEstadoId: number): void {
    if (this.estadoPromocionId === EstadoPromocionEnum.FINALIZADA) {
      throw new InvalidPromotionStateException(
        'Una promoción en estado "Finalizada" no puede modificarse.'
      );
    }

    if (this.estadoPromocionId === EstadoPromocionEnum.PROGRAMADA) {
      if (nuevoEstadoId !== EstadoPromocionEnum.ACTIVA) {
        throw new InvalidPromotionStateException(
          'Una promoción en estado "Programada" solo puede pasar a estado "Activa".'
        );
      }
      this.estadoPromocionId = EstadoPromocionEnum.ACTIVA;
      this.activa = true;
      return;
    }

    if (this.estadoPromocionId === EstadoPromocionEnum.ACTIVA) {
      if (nuevoEstadoId !== EstadoPromocionEnum.FINALIZADA) {
        throw new InvalidPromotionStateException(
          'Una promoción en estado "Activa" solo puede pasar a estado "Finalizada".'
        );
      }
      this.estadoPromocionId = EstadoPromocionEnum.FINALIZADA;
      this.activa = false;
      return;
    }

    throw new InvalidPromotionStateException(
      `Transición de estado no válida desde el estado actual (${this.estadoPromocionId}).`
    );
  }

  /**
   * Validates if promotion can be deleted (only if Programada)
   */
  public validarParaEliminacion(): void {
    if (this.estadoPromocionId !== EstadoPromocionEnum.PROGRAMADA) {
      throw new InvalidPromotionStateException(
        'Solo se pueden eliminar promociones en estado "Programada".'
      );
    }
  }

  /**
   * Ensures promotion is not finalizada before updates
   */
  public validarModificacion(): void {
    if (this.estadoPromocionId === EstadoPromocionEnum.FINALIZADA) {
      throw new InvalidPromotionStateException(
        'Una promoción en estado "Finalizada" no puede modificarse.'
      );
    }
  }
}
