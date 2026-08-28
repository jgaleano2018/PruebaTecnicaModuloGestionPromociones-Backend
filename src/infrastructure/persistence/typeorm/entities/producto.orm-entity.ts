import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CategoriaOrmEntity } from './categoria.orm-entity';
import { PromocionProductoOrmEntity } from './promocion-producto.orm-entity';
import { DetalleVentaOrmEntity } from './detalle-venta.orm-entity';

@Entity({ name: 'productos' })
export class ProductoOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'codigo_barras', type: 'varchar', length: 50, unique: true })
  codigoBarras: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  descripcion: string | null;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 18, scale: 2 })
  precioVenta: number;

  @Column({ name: 'precio_costo', type: 'decimal', precision: 18, scale: 2 })
  precioCosto: number;

  @Column({ name: 'stock_actual', type: 'decimal', precision: 18, scale: 3 })
  stockActual: number;

  @Column({ name: 'categoria_id', type: 'int' })
  categoriaId: number;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @ManyToOne(() => CategoriaOrmEntity, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaOrmEntity;

  @OneToMany(() => PromocionProductoOrmEntity, (pp) => pp.producto)
  promocionProductos: PromocionProductoOrmEntity[];

  @OneToMany(() => DetalleVentaOrmEntity, (dv) => dv.producto)
  detallesVenta: DetalleVentaOrmEntity[];
}
