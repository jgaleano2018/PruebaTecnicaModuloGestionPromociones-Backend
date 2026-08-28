import { Promocion } from './promocion.entity';
import { EstadoPromocionEnum } from '../value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../value-objects/tipo-descuento.enum';
import {
  BusinessRuleValidationException,
  InvalidPromotionStateException,
} from '../exceptions/domain.exception';

describe('Domain Entity: Promocion', () => {
  const baseValidProps = {
    nombre: 'Promoción Verano 2026',
    tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
    valorDescuento: 20,
    fechaInicio: new Date('2026-08-01T00:00:00Z'),
    fechaFin: new Date('2026-08-31T23:59:59Z'),
    productoIds: [1, 2],
    categoriaIds: [],
  };

  it('debe crear una promoción válida exitosamente', () => {
    const promocion = Promocion.create(baseValidProps);
    expect(promocion).toBeDefined();
    expect(promocion.nombre).toBe('Promoción Verano 2026');
    expect(promocion.estadoPromocionId).toBe(EstadoPromocionEnum.PROGRAMADA);
    expect(promocion.activa).toBe(false);
  });

  it('debe fallar si no se proporciona nombre', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        nombre: '',
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe fallar si no tiene productos ni categorías asociadas', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        productoIds: [],
        categoriaIds: [],
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe fallar si el valor de descuento es menor o igual a 0', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        valorDescuento: 0,
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe fallar si el descuento es Porcentaje y supera 100', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
        valorDescuento: 150,
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe fallar si el descuento es Porcentaje y es menor a 1', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
        valorDescuento: 0.5,
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe fallar si la fecha de fin no es posterior a la fecha de inicio', () => {
    expect(() =>
      Promocion.create({
        ...baseValidProps,
        fechaInicio: new Date('2026-08-15T00:00:00Z'),
        fechaFin: new Date('2026-08-10T00:00:00Z'),
      })
    ).toThrow(BusinessRuleValidationException);
  });

  it('debe permitir la transición de estado: Programada -> Activa -> Finalizada', () => {
    const promocion = Promocion.create(baseValidProps);
    expect(promocion.estadoPromocionId).toBe(EstadoPromocionEnum.PROGRAMADA);

    promocion.cambiarEstado(EstadoPromocionEnum.ACTIVA);
    expect(promocion.estadoPromocionId).toBe(EstadoPromocionEnum.ACTIVA);
    expect(promocion.activa).toBe(true);

    promocion.cambiarEstado(EstadoPromocionEnum.FINALIZADA);
    expect(promocion.estadoPromocionId).toBe(EstadoPromocionEnum.FINALIZADA);
    expect(promocion.activa).toBe(false);
  });

  it('debe rechazar pasar directamente de Programada a Finalizada', () => {
    const promocion = Promocion.create(baseValidProps);
    expect(() => promocion.cambiarEstado(EstadoPromocionEnum.FINALIZADA)).toThrow(
      InvalidPromotionStateException
    );
  });

  it('no debe permitir modificar ni cambiar estado una vez Finalizada', () => {
    const promocion = Promocion.create(baseValidProps);
    promocion.cambiarEstado(EstadoPromocionEnum.ACTIVA);
    promocion.cambiarEstado(EstadoPromocionEnum.FINALIZADA);

    expect(() => promocion.cambiarEstado(EstadoPromocionEnum.ACTIVA)).toThrow(
      InvalidPromotionStateException
    );
    expect(() => promocion.validarModificacion()).toThrow(InvalidPromotionStateException);
  });

  it('solo debe permitir eliminar promociones en estado Programada', () => {
    const promocion = Promocion.create(baseValidProps);
    expect(() => promocion.validarParaEliminacion()).not.toThrow();

    promocion.cambiarEstado(EstadoPromocionEnum.ACTIVA);
    expect(() => promocion.validarParaEliminacion()).toThrow(InvalidPromotionStateException);
  });
});
