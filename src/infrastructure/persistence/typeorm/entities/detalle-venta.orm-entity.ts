import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VentaOrmEntity } from './venta.orm-entity';
import { ProductoOrmEntity } from './producto.orm-entity';
import { PromocionOrmEntity } from './promocion.orm-entity';

@Entity({ name: 'detalle_ventas' })
export class DetalleVentaOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'venta_id', type: 'int' })
  ventaId: number;

  @Column({ name: 'producto_id', type: 'int' })
  productoId: number;

  @Column({ type: 'decimal', precision: 18, scale: 3 })
  cantidad: number;

  @Column({ name: 'precio_regular', type: 'decimal', precision: 18, scale: 2 })
  precioRegular: number;

  @Column({ name: 'promocion_id', type: 'int', nullable: true })
  promocionId: number | null;

  @Column({ name: 'descuento_aplicado', type: 'decimal', precision: 18, scale: 2 })
  descuentoAplicado: number;

  @Column({ name: 'precio_final', type: 'decimal', precision: 18, scale: 2 })
  precioFinal: number;

  @ManyToOne(() => VentaOrmEntity, (venta) => venta.detalles)
  @JoinColumn({ name: 'venta_id' })
  venta: VentaOrmEntity;

  @ManyToOne(() => ProductoOrmEntity, (producto) => producto.detallesVenta)
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoOrmEntity;

  @ManyToOne(() => PromocionOrmEntity, (promocion) => promocion.detallesVenta, {
    nullable: true,
  })
  @JoinColumn({ name: 'promocion_id' })
  promocion: PromocionOrmEntity | null;
}
