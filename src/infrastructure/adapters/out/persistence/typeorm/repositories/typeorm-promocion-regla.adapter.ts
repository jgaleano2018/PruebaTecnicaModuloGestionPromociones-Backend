import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromocionRegla } from '../../../../../../domain/entities/promocion-regla.entity';
import { PromocionReglaRepositoryPort } from '../../../../../../application/ports/output/promocion.repository.port';
import { PromocionReglaOrmEntity } from '../../../../../persistence/typeorm/entities/promocion-regla.orm-entity';

@Injectable()
export class TypeOrmPromocionReglaAdapter implements PromocionReglaRepositoryPort {
  constructor(
    @InjectRepository(PromocionReglaOrmEntity)
    private readonly repository: Repository<PromocionReglaOrmEntity>
  ) {}

  public create(regla: PromocionRegla): Observable<PromocionRegla> {
    const savePromise = async (): Promise<PromocionRegla> => {
      const orm = new PromocionReglaOrmEntity();
      if (regla.id) orm.id = regla.id;
      if (regla.promocionId) orm.promocionId = regla.promocionId;
      orm.diasSemana = regla.diasSemana ?? null;
      orm.horaInicio = regla.horaInicio ?? null;
      orm.horaFin = regla.horaFin ?? null;
      orm.limiteUsosPorTicket = regla.limiteUsosPorTicket ?? null;

      const saved = await this.repository.save(orm);
      return new PromocionRegla(
        saved.id,
        saved.promocionId,
        saved.diasSemana,
        saved.horaInicio,
        saved.horaFin,
        saved.limiteUsosPorTicket
      );
    };

    return from(savePromise());
  }

  public findByPromocionId(promocionId: number): Observable<PromocionRegla[]> {
    return from(this.repository.find({ where: { promocionId } })).pipe(
      map((entities) =>
        entities.map(
          (e) =>
            new PromocionRegla(
              e.id,
              e.promocionId,
              e.diasSemana,
              e.horaInicio,
              e.horaFin,
              e.limiteUsosPorTicket
            )
        )
      )
    );
  }

  public findById(id: number): Observable<PromocionRegla | null> {
    return from(this.repository.findOne({ where: { id } })).pipe(
      map((entity) =>
        entity
          ? new PromocionRegla(
              entity.id,
              entity.promocionId,
              entity.diasSemana,
              entity.horaInicio,
              entity.horaFin,
              entity.limiteUsosPorTicket
            )
          : null
      )
    );
  }

  public delete(id: number): Observable<boolean> {
    return from(this.repository.delete(id)).pipe(
      map((result) => (result.affected ?? 0) > 0)
    );
  }
}
