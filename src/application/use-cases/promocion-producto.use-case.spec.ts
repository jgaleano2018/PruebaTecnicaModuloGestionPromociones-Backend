import { of } from 'rxjs';
import { CreatePromocionProductoUseCase } from './create-promocion-producto.use-case';
import { PromocionProductoRepositoryInterface } from '../../domain/repositories/promocion-producto.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { ProductoRepositoryInterface } from '../../domain/repositories/producto.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { Producto } from '../../domain/entities/producto.entity';
import { PromocionProducto } from '../../domain/entities/promocion-producto.entity';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../../domain/value-objects/tipo-descuento.enum';
import {
  PromotionNotFoundException,
  BusinessRuleValidationException,
  InvalidPromotionStateException,
} from '../../domain/exceptions/domain.exception';

describe('Application Layer: CreatePromocionProductoUseCase', () => {
  let mockPromocionProductoRepo: jest.Mocked<PromocionProductoRepositoryInterface>;
  let mockPromocionRepo: jest.Mocked<PromocionRepositoryInterface>;
  let mockProductoRepo: jest.Mocked<ProductoRepositoryInterface>;

  beforeEach(() => {
    mockPromocionProductoRepo = {
      create: jest.fn(),
      findByPromocionId: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
    };
    mockPromocionRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countByEstado: jest.fn(),
      countVigentes: jest.fn(),
    };
    mockProductoRepo = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
    };
  });

  it('debe asociar un producto a la promoción exitosamente', (done) => {
    const useCase = new CreatePromocionProductoUseCase(
      mockPromocionProductoRepo,
      mockPromocionRepo,
      mockProductoRepo
    );

    const dto = {
      promocionId: 1,
      productoId: 3,
    };

    const promo = new Promocion({
      id: 1,
      nombre: 'Promo Snacks',
      tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
      valorDescuento: 20,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [1],
      estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
      activa: false,
    });

    const producto = new Producto(
      3,
      '770100100003',
      'Papas Fritas',
      'Papas 115g',
      4500,
      2800,
      80,
      2,
      true
    );

    const saved = new PromocionProducto(1, 3);

    mockPromocionRepo.findById.mockReturnValue(of(promo));
    mockProductoRepo.findByIds.mockReturnValue(of([producto]));
    mockPromocionProductoRepo.exists.mockReturnValue(of(false));
    mockPromocionProductoRepo.create.mockReturnValue(of(saved));

    useCase.execute(dto).subscribe({
      next: (res) => {
        expect(res.promocionId).toBe(1);
        expect(res.productoId).toBe(3);
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe fallar si la promoción no existe', (done) => {
    const useCase = new CreatePromocionProductoUseCase(
      mockPromocionProductoRepo,
      mockPromocionRepo,
      mockProductoRepo
    );

    mockPromocionRepo.findById.mockReturnValue(of(null));

    useCase.execute({ promocionId: 99, productoId: 1 }).subscribe({
      next: () => done.fail('No debió asociar'),
      error: (err) => {
        expect(err).toBeInstanceOf(PromotionNotFoundException);
        done();
      },
    });
  });

  it('debe fallar si la promoción está Finalizada', (done) => {
    const useCase = new CreatePromocionProductoUseCase(
      mockPromocionProductoRepo,
      mockPromocionRepo,
      mockProductoRepo
    );

    const promoFinalizada = new Promocion({
      id: 1,
      nombre: 'Promo Fin',
      tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [1],
      estadoPromocionId: EstadoPromocionEnum.FINALIZADA,
      activa: false,
    });

    mockPromocionRepo.findById.mockReturnValue(of(promoFinalizada));

    useCase.execute({ promocionId: 1, productoId: 1 }).subscribe({
      next: () => done.fail('No debió asociar'),
      error: (err) => {
        expect(err).toBeInstanceOf(InvalidPromotionStateException);
        done();
      },
    });
  });

  it('debe fallar si el producto ya está asociado', (done) => {
    const useCase = new CreatePromocionProductoUseCase(
      mockPromocionProductoRepo,
      mockPromocionRepo,
      mockProductoRepo
    );

    const promo = new Promocion({
      id: 1,
      nombre: 'Promo 1',
      tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [1],
      estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
      activa: false,
    });

    const producto = new Producto(
      1,
      '770100100001',
      'Gaseosa Cola',
      'Bebida',
      5000,
      3200,
      100,
      1,
      true
    );

    mockPromocionRepo.findById.mockReturnValue(of(promo));
    mockProductoRepo.findByIds.mockReturnValue(of([producto]));
    mockPromocionProductoRepo.exists.mockReturnValue(of(true));

    useCase.execute({ promocionId: 1, productoId: 1 }).subscribe({
      next: () => done.fail('No debió duplicar el producto'),
      error: (err) => {
        expect(err).toBeInstanceOf(BusinessRuleValidationException);
        done();
      },
    });
  });
});
