import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromocionOrmEntity } from './promocion.orm-entity';
import { CategoriaOrmEntity } from './categoria.orm-entity';

@Entity({ name: 'promocion_categorias' })
export class PromocionCategoriaOrmEntity {
  @PrimaryColumn({ name: 'promocion_id', type: 'int' })
  promocionId: number;

  @PrimaryColumn({ name: 'categoria_id', type: 'int' })
  categoriaId: number;

  @ManyToOne(() => PromocionOrmEntity, (promocion) => promocion.promocionCategorias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promocion_id' })
  promocion: PromocionOrmEntity;

  @ManyToOne(() => CategoriaOrmEntity, (categoria) => categoria.promocionCategorias)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaOrmEntity;
}
