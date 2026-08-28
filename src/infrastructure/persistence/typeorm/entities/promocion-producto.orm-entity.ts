import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromocionOrmEntity } from './promocion.orm-entity';
import { ProductoOrmEntity } from './producto.orm-entity';

@Entity({ name: 'promocion_productos' })
export class PromocionProductoOrmEntity {
  @PrimaryColumn({ name: 'promocion_id', type: 'int' })
  promocionId: number;

  @PrimaryColumn({ name: 'producto_id', type: 'int' })
  productoId: number;

  @ManyToOne(() => PromocionOrmEntity, (promocion) => promocion.promocionProductos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promocion_id' })
  promocion: PromocionOrmEntity;

  @ManyToOne(() => ProductoOrmEntity, (producto) => producto.promocionProductos)
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoOrmEntity;
}
