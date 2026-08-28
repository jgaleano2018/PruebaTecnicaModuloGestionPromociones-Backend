import { of } from 'rxjs';
import { CreatePromocionCategoriaUseCase } from './create-promocion-categoria.use-case';
import { PromocionCategoriaRepositoryInterface } from '../../domain/repositories/promocion-categoria.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { CategoriaRepositoryInterface } from '../../domain/repositories/categoria.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { Categoria } from '../../domain/entities/categoria.entity';
import { PromocionCategoria } from '../../domain/entities/promocion-categoria.entity';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../../domain/value-objects/tipo-descuento.enum';
import {
  PromotionNotFoundException,
  BusinessRuleValidationException,
  InvalidPromotionStateException,
} from '../../domain/exceptions/domain.exception';

describe('Application Layer: CreatePromocionCategoriaUseCase', () => {
  let mockPromocionCategoriaRepo: jest.Mocked<PromocionCategoriaRepositoryInterface>;
  let mockPromocionRepo: jest.Mocked<PromocionRepositoryInterface>;
  let mockCategoriaRepo: jest.Mocked<CategoriaRepositoryInterface>;

  beforeEach(() => {
    mockPromocionCategoriaRepo = {
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
    mockCategoriaRepo = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
    };
  });

  it('debe asociar una categoría a la promoción exitosamente', (done) => {
    const useCase = new CreatePromocionCategoriaUseCase(
      mockPromocionCategoriaRepo,
      mockPromocionRepo,
      mockCategoriaRepo
    );

    const dto = {
      promocionId: 1,
      categoriaId: 2,
    };

    const promo = new Promocion({
      id: 1,
      nombre: 'Promo 1',
      tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
      valorDescuento: 15,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [1],
      estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
      activa: false,
    });

    const categoria = new Categoria(2, 'Lácteos', 'Leches y quesos', true);
    const saved = new PromocionCategoria(1, 2);

    mockPromocionRepo.findById.mockReturnValue(of(promo));
    mockCategoriaRepo.findByIds.mockReturnValue(of([categoria]));
    mockPromocionCategoriaRepo.exists.mockReturnValue(of(false));
    mockPromocionCategoriaRepo.create.mockReturnValue(of(saved));

    useCase.execute(dto).subscribe({
      next: (res) => {
        expect(res.promocionId).toBe(1);
        expect(res.categoriaId).toBe(2);
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe fallar si la promoción no existe', (done) => {
    const useCase = new CreatePromocionCategoriaUseCase(
      mockPromocionCategoriaRepo,
      mockPromocionRepo,
      mockCategoriaRepo
    );

    mockPromocionRepo.findById.mockReturnValue(of(null));

    useCase.execute({ promocionId: 99, categoriaId: 1 }).subscribe({
      next: () => done.fail('No debió asociar'),
      error: (err) => {
        expect(err).toBeInstanceOf(PromotionNotFoundException);
        done();
      },
    });
  });

  it('debe fallar si la promoción está Finalizada', (done) => {
    const useCase = new CreatePromocionCategoriaUseCase(
      mockPromocionCategoriaRepo,
      mockPromocionRepo,
      mockCategoriaRepo
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

    useCase.execute({ promocionId: 1, categoriaId: 1 }).subscribe({
      next: () => done.fail('No debió asociar'),
      error: (err) => {
        expect(err).toBeInstanceOf(InvalidPromotionStateException);
        done();
      },
    });
  });

  it('debe fallar si la categoría ya está asociada', (done) => {
    const useCase = new CreatePromocionCategoriaUseCase(
      mockPromocionCategoriaRepo,
      mockPromocionRepo,
      mockCategoriaRepo
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

    const categoria = new Categoria(1, 'Bebidas', 'Bebidas', true);

    mockPromocionRepo.findById.mockReturnValue(of(promo));
    mockCategoriaRepo.findByIds.mockReturnValue(of([categoria]));
    mockPromocionCategoriaRepo.exists.mockReturnValue(of(true));

    useCase.execute({ promocionId: 1, categoriaId: 1 }).subscribe({
      next: () => done.fail('No debió duplicar la categoría'),
      error: (err) => {
        expect(err).toBeInstanceOf(BusinessRuleValidationException);
        done();
      },
    });
  });
});
