import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromocionOrmEntity } from './promocion.orm-entity';

@Entity({ name: 'promocion_reglas' })
export class PromocionReglaOrmEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'promocion_id', type: 'int' })
  promocionId: number;

  @Column({ name: 'dias_semana', type: 'varchar', length: 20, nullable: true })
  diasSemana: string | null;

  @Column({ name: 'hora_inicio', type: 'time', precision: 0, nullable: true })
  horaInicio: string | null;

  @Column({ name: 'hora_fin', type: 'time', precision: 0, nullable: true })
  horaFin: string | null;

  @Column({ name: 'limite_usos_por_ticket', type: 'int', nullable: true })
  limiteUsosPorTicket: number | null;

  @ManyToOne(() => PromocionOrmEntity, (promocion) => promocion.reglas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promocion_id' })
  promocion: PromocionOrmEntity;
}
