import { PromocionEntityMapper } from './promocion-entity.mapper';
import { PromocionOrmEntity } from '../entities/promocion.orm-entity';
import { Promocion } from '../../../../domain/entities/promocion.entity';
import { PromocionRegla } from '../../../../domain/entities/promocion-regla.entity';
import { TipoDescuentoEnum } from '../../../../domain/value-objects/tipo-descuento.enum';
import { EstadoPromocionEnum } from '../../../../domain/value-objects/estado-promocion.enum';

describe('Infrastructure Mapper: PromocionEntityMapper', () => {
  it('debe transformar PromocionOrmEntity a Dominio Promocion', () => {
    const orm = new PromocionOrmEntity();
    orm.id = 10;
    orm.nombre = 'Promo ORM';
    orm.descripcion = 'Descripción';
    orm.tipoDescuentoId = TipoDescuentoEnum.PORCENTAJE;
    orm.valorDescuento = 20;
    orm.cantidadMinima = 1;
    orm.cantidadPagada = 1;
    orm.fechaInicio = new Date('2026-08-01');
    orm.fechaFin = new Date('2026-08-31');
    orm.activa = true;
    orm.estadoPromocionId = EstadoPromocionEnum.ACTIVA;
    orm.promocionProductos = [{ promocionId: 10, productoId: 1 } as any];
    orm.promocionCategorias = [{ promocionId: 10, categoriaId: 2 } as any];
    orm.reglas = [
      {
        id: 1,
        promocionId: 10,
        diasSemana: 'LUN',
        horaInicio: '08:00',
        horaFin: '12:00',
        limiteUsosPorTicket: 2,
      } as any,
    ];

    const domain = PromocionEntityMapper.toDomain(orm);

    expect(domain.id).toBe(10);
    expect(domain.nombre).toBe('Promo ORM');
    expect(domain.productoIds).toEqual([1]);
    expect(domain.categoriaIds).toEqual([2]);
    expect(domain.reglas).toHaveLength(1);
    expect(domain.reglas[0].diasSemana).toBe('LUN');
  });

  it('debe transformar Dominio Promocion a PromocionOrmEntity', () => {
    const domain = new Promocion({
      id: 20,
      nombre: 'Promo Dominio to ORM',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [5],
      categoriaIds: [7],
      reglas: [new PromocionRegla(undefined, 20, 'MAR', '09:00', '15:00', 3)],
    });

    const orm = PromocionEntityMapper.toOrmEntity(domain);

    expect(orm.id).toBe(20);
    expect(orm.nombre).toBe('Promo Dominio to ORM');
    expect(orm.promocionProductos).toHaveLength(1);
    expect(orm.promocionProductos[0].productoId).toBe(5);
    expect(orm.promocionCategorias).toHaveLength(1);
    expect(orm.promocionCategorias[0].categoriaId).toBe(7);
    expect(orm.reglas).toHaveLength(1);
  });
});
