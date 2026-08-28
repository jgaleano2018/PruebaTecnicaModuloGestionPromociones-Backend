import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProductoOrmEntity } from './producto.orm-entity';
import { PromocionCategoriaOrmEntity } from './promocion-categoria.orm-entity';

@Entity({ name: 'categorias' })
export class CategoriaOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  descripcion: string | null;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @OneToMany(() => ProductoOrmEntity, (producto) => producto.categoria)
  productos: ProductoOrmEntity[];

  @OneToMany(() => PromocionCategoriaOrmEntity, (pc) => pc.categoria)
  promocionCategorias: PromocionCategoriaOrmEntity[];
}
