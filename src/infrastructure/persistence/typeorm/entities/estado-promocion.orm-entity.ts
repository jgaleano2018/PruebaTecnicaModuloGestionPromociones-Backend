import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { PromocionOrmEntity } from './promocion.orm-entity';

@Entity({ name: 'estados_promocion' })
export class EstadoPromocionOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcion: string | null;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @OneToMany(() => PromocionOrmEntity, (promocion) => promocion.estadoPromocion)
  promociones: PromocionOrmEntity[];
}
