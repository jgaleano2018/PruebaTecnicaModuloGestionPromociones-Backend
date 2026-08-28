import { PromocionRepositoryInterface } from '../../../domain/repositories/promocion.repository.interface';
import { CategoriaRepositoryInterface } from '../../../domain/repositories/categoria.repository.interface';
import { ProductoRepositoryInterface } from '../../../domain/repositories/producto.repository.interface';
import { TipoDescuentoRepositoryInterface } from '../../../domain/repositories/tipo-descuento.repository.interface';
import { EstadoPromocionRepositoryInterface } from '../../../domain/repositories/estado-promocion.repository.interface';
import { PromocionReglaRepositoryInterface } from '../../../domain/repositories/promocion-regla.repository.interface';
import { PromocionCategoriaRepositoryInterface } from '../../../domain/repositories/promocion-categoria.repository.interface';
import { PromocionProductoRepositoryInterface } from '../../../domain/repositories/promocion-producto.repository.interface';

export type PromocionRepositoryPort = PromocionRepositoryInterface;
export type CategoriaRepositoryPort = CategoriaRepositoryInterface;
export type ProductoRepositoryPort = ProductoRepositoryInterface;
export type TipoDescuentoRepositoryPort = TipoDescuentoRepositoryInterface;
export type EstadoPromocionRepositoryPort = EstadoPromocionRepositoryInterface;
export type PromocionReglaRepositoryPort = PromocionReglaRepositoryInterface;
export type PromocionCategoriaRepositoryPort = PromocionCategoriaRepositoryInterface;
export type PromocionProductoRepositoryPort = PromocionProductoRepositoryInterface;

export const PROMOCION_REPOSITORY_PORT = Symbol('PROMOCION_REPOSITORY_PORT');
export const CATEGORIA_REPOSITORY_PORT = Symbol('CATEGORIA_REPOSITORY_PORT');
export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT');
export const TIPO_DESCUENTO_REPOSITORY_PORT = Symbol('TIPO_DESCUENTO_REPOSITORY_PORT');
export const ESTADO_PROMOCION_REPOSITORY_PORT = Symbol('ESTADO_PROMOCION_REPOSITORY_PORT');
export const PROMOCION_REGLA_REPOSITORY_PORT = Symbol('PROMOCION_REGLA_REPOSITORY_PORT');
export const PROMOCION_CATEGORIA_REPOSITORY_PORT = Symbol('PROMOCION_CATEGORIA_REPOSITORY_PORT');
export const PROMOCION_PRODUCTO_REPOSITORY_PORT = Symbol('PROMOCION_PRODUCTO_REPOSITORY_PORT');
