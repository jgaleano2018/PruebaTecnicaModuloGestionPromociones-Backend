import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Promocion } from '../../../../domain/entities/promocion.entity';
import {
  PromocionRepositoryInterface,
  ResumenConteoEstados,
  ResumenVigencia,
} from '../../../../domain/repositories/promocion.repository.interface';
import { EstadoPromocionEnum } from '../../../../domain/value-objects/estado-promocion.enum';
import { AppDataSource } from '../data-source';
import { PromocionOrmEntity } from '../entities/promocion.orm-entity';
import { PromocionProductoOrmEntity } from '../entities/promocion-producto.orm-entity';
import { PromocionCategoriaOrmEntity } from '../entities/promocion-categoria.orm-entity';
import { PromocionReglaOrmEntity } from '../entities/promocion-regla.orm-entity';
import { PromocionEntityMapper } from '../mappers/promocion-entity.mapper';

export class TypeOrmPromocionRepository implements PromocionRepositoryInterface {
  private get repository(): Repository<PromocionOrmEntity> {
    return AppDataSource.getRepository(PromocionOrmEntity);
  }

  public create(promocion: Promocion): Observable<Promocion> {
    const savePromise = async (): Promise<Promocion> => {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const ormEntity = PromocionEntityMapper.toOrmEntity(promocion);
        const savedPromocion = await queryRunner.manager.save(PromocionOrmEntity, ormEntity);

        if (promocion.productoIds && promocion.productoIds.length > 0) {
          const productos = promocion.productoIds.map((pId) => {
            const pp = new PromocionProductoOrmEntity();
            pp.promocionId = savedPromocion.id;
            pp.productoId = pId;
            return pp;
          });
          await queryRunner.manager.save(PromocionProductoOrmEntity, productos);
        }

        if (promocion.categoriaIds && promocion.categoriaIds.length > 0) {
          const categorias = promocion.categoriaIds.map((cId) => {
            const pc = new PromocionCategoriaOrmEntity();
            pc.promocionId = savedPromocion.id;
            pc.categoriaId = cId;
            return pc;
          });
          await queryRunner.manager.save(PromocionCategoriaOrmEntity, categorias);
        }

        if (promocion.reglas && promocion.reglas.length > 0) {
          const reglas = promocion.reglas.map((r) => {
            const pr = new PromocionReglaOrmEntity();
            pr.promocionId = savedPromocion.id;
            pr.diasSemana = r.diasSemana ?? null;
            pr.horaInicio = r.horaInicio ?? null;
            pr.horaFin = r.horaFin ?? null;
            pr.limiteUsosPorTicket = r.limiteUsosPorTicket ?? null;
            return pr;
          });
          await queryRunner.manager.save(PromocionReglaOrmEntity, reglas);
        }

        await queryRunner.commitTransaction();

        const fullPromocion = await this.repository.findOne({
          where: { id: savedPromocion.id },
          relations: [
            'tipoDescuento',
            'estadoPromocion',
            'promocionProductos',
            'promocionProductos.producto',
            'promocionCategorias',
            'promocionCategorias.categoria',
            'reglas',
          ],
        });

        if (!fullPromocion) {
          throw new Error('Error al recuperar la promoción creada.');
        }

        return PromocionEntityMapper.toDomain(fullPromocion);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    };

    return from(savePromise());
  }

  public findAll(): Observable<Promocion[]> {
    return from(
      this.repository.find({
        relations: [
          'tipoDescuento',
          'estadoPromocion',
          'promocionProductos',
          'promocionProductos.producto',
          'promocionCategorias',
          'promocionCategorias.categoria',
          'reglas',
        ],
        order: { id: 'DESC' },
      })
    ).pipe(
      map((entities) => entities.map((entity) => PromocionEntityMapper.toDomain(entity)))
    );
  }

  public findById(id: number): Observable<Promocion | null> {
    return from(
      this.repository.findOne({
        where: { id },
        relations: [
          'tipoDescuento',
          'estadoPromocion',
          'promocionProductos',
          'promocionProductos.producto',
          'promocionCategorias',
          'promocionCategorias.categoria',
          'reglas',
        ],
      })
    ).pipe(
      map((entity) => (entity ? PromocionEntityMapper.toDomain(entity) : null))
    );
  }

  public update(promocion: Promocion): Observable<Promocion> {
    const updatePromise = async (): Promise<Promocion> => {
      if (!promocion.id) {
        throw new Error('No se puede actualizar una promoción sin ID.');
      }

      await this.repository.update(promocion.id, {
        nombre: promocion.nombre,
        descripcion: promocion.descripcion,
        tipoDescuentoId: promocion.tipoDescuentoId,
        valorDescuento: promocion.valorDescuento,
        cantidadMinima: promocion.cantidadMinima,
        cantidadPagada: promocion.cantidadPagada,
        fechaInicio: promocion.fechaInicio,
        fechaFin: promocion.fechaFin,
        activa: promocion.activa,
        estadoPromocionId: promocion.estadoPromocionId,
      });

      const updated = await this.repository.findOne({
        where: { id: promocion.id },
        relations: [
          'tipoDescuento',
          'estadoPromocion',
          'promocionProductos',
          'promocionProductos.producto',
          'promocionCategorias',
          'promocionCategorias.categoria',
          'reglas',
        ],
      });

      if (!updated) {
        throw new Error(`Promoción con ID ${promocion.id} no encontrada tras actualización.`);
      }

      return PromocionEntityMapper.toDomain(updated);
    };

    return from(updatePromise());
  }

  public delete(id: number): Observable<boolean> {
    const deletePromise = async (): Promise<boolean> => {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.delete(PromocionProductoOrmEntity, { promocionId: id });
        await queryRunner.manager.delete(PromocionCategoriaOrmEntity, { promocionId: id });
        await queryRunner.manager.delete(PromocionReglaOrmEntity, { promocionId: id });
        const result = await queryRunner.manager.delete(PromocionOrmEntity, { id });

        await queryRunner.commitTransaction();
        return (result.affected ?? 0) > 0;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    };

    return from(deletePromise());
  }

  public countByEstado(): Observable<ResumenConteoEstados> {
    const countPromise = async (): Promise<ResumenConteoEstados> => {
      const programada = await this.repository.count({
        where: { estadoPromocionId: EstadoPromocionEnum.PROGRAMADA },
      });
      const activa = await this.repository.count({
        where: { estadoPromocionId: EstadoPromocionEnum.ACTIVA },
      });
      const finalizada = await this.repository.count({
        where: { estadoPromocionId: EstadoPromocionEnum.FINALIZADA },
      });

      return {
        programada,
        activa,
        finalizada,
        total: programada + activa + finalizada,
      };
    };

    return from(countPromise());
  }

  public countVigentes(
    fechaInicio: Date,
    fechaFin: Date,
    fechaReferencia: Date = new Date()
  ): Observable<ResumenVigencia> {
    const queryPromise = async (): Promise<ResumenVigencia> => {
      const queryBuilder = this.repository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.tipoDescuento', 'td')
        .leftJoinAndSelect('p.estadoPromocion', 'ep')
        .leftJoinAndSelect('p.promocionProductos', 'pp')
        .leftJoinAndSelect('pp.producto', 'prod')
        .leftJoinAndSelect('p.promocionCategorias', 'pc')
        .leftJoinAndSelect('pc.categoria', 'cat')
        .leftJoinAndSelect('p.reglas', 'reg')
        .where('p.fecha_inicio <= :fechaFinFiltro AND p.fecha_fin >= :fechaInicioFiltro', {
          fechaInicioFiltro: fechaInicio,
          fechaFinFiltro: fechaFin,
        })
        .andWhere('p.fecha_inicio <= :fechaRef AND p.fecha_fin >= :fechaRef', {
          fechaRef: fechaReferencia,
        })
        .andWhere('p.estado_promocion_id = :estadoActiva', {
          estadoActiva: EstadoPromocionEnum.ACTIVA,
        });

      const entities = await queryBuilder.getMany();
      const promociones = entities.map((e) => PromocionEntityMapper.toDomain(e));

      return {
        totalVigentes: promociones.length,
        fechaInicioFiltro: fechaInicio.toISOString(),
        fechaFinFiltro: fechaFin.toISOString(),
        promociones,
      };
    };

    return from(queryPromise());
  }
}
