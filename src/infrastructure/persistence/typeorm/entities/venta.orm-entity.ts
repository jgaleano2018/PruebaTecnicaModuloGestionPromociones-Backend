import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { DetalleVentaOrmEntity } from './detalle-venta.orm-entity';

@Entity({ name: 'ventas' })
export class VentaOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'fecha_venta', type: 'datetime2', precision: 0 })
  fechaVenta: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  subtotal: number;

  @Column({ name: 'descuento_total', type: 'decimal', precision: 18, scale: 2 })
  descuentoTotal: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total: number;

  @OneToMany(() => DetalleVentaOrmEntity, (detalle) => detalle.venta)
  detalles: DetalleVentaOrmEntity[];
}
