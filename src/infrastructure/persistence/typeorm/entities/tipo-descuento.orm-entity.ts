import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { PromocionOrmEntity } from './promocion.orm-entity';

@Entity({ name: 'tipo_descuento' })
export class TipoDescuentoOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20 })
  nombre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  descripcion: string | null;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @OneToMany(() => PromocionOrmEntity, (promocion) => promocion.tipoDescuento)
  promociones: PromocionOrmEntity[];
}
