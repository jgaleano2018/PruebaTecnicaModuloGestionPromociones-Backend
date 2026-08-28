import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TipoDescuentoOrmEntity } from './tipo-descuento.orm-entity';
import { EstadoPromocionOrmEntity } from './estado-promocion.orm-entity';
import { PromocionProductoOrmEntity } from './promocion-producto.orm-entity';
import { PromocionCategoriaOrmEntity } from './promocion-categoria.orm-entity';
import { PromocionReglaOrmEntity } from './promocion-regla.orm-entity';
import { DetalleVentaOrmEntity } from './detalle-venta.orm-entity';

@Entity({ name: 'promociones' })
export class PromocionOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  descripcion: string | null;

  @Column({ name: 'tipo_descuento_id', type: 'int' })
  tipoDescuentoId: number;

  @Column({
    name: 'valor_descuento',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value?: string | null) => (value !== null && value !== undefined ? parseFloat(value) : null),
    },
  })
  valorDescuento: number;

  @Column({ name: 'cantidad_minima', type: 'int', nullable: true })
  cantidadMinima: number | null;

  @Column({ name: 'cantidad_pagada', type: 'int', nullable: true })
  cantidadPagada: number | null;

  @Column({ name: 'fecha_inicio', type: 'datetime2', precision: 0 })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'datetime2', precision: 0 })
  fechaFin: Date;

  @Column({ type: 'bit', default: false })
  activa: boolean;

  @Column({ name: 'estado_promocion_id', type: 'int' })
  estadoPromocionId: number;

  @ManyToOne(() => TipoDescuentoOrmEntity, (tipo) => tipo.promociones)
  @JoinColumn({ name: 'tipo_descuento_id' })
  tipoDescuento: TipoDescuentoOrmEntity;

  @ManyToOne(() => EstadoPromocionOrmEntity, (estado) => estado.promociones)
  @JoinColumn({ name: 'estado_promocion_id' })
  estadoPromocion: EstadoPromocionOrmEntity;

  @OneToMany(() => PromocionProductoOrmEntity, (pp) => pp.promocion, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  promocionProductos: PromocionProductoOrmEntity[];

  @OneToMany(() => PromocionCategoriaOrmEntity, (pc) => pc.promocion, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  promocionCategorias: PromocionCategoriaOrmEntity[];

  @OneToMany(() => PromocionReglaOrmEntity, (pr) => pr.promocion, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reglas: PromocionReglaOrmEntity[];

  @OneToMany(() => DetalleVentaOrmEntity, (dv) => dv.promocion)
  detallesVenta: DetalleVentaOrmEntity[];
}
