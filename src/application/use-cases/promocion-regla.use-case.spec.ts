import { of, throwError } from 'rxjs';
import { CreatePromocionReglaUseCase } from './create-promocion-regla.use-case';
import { PromocionReglaRepositoryInterface } from '../../domain/repositories/promocion-regla.repository.interface';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { PromocionRegla } from '../../domain/entities/promocion-regla.entity';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../../domain/value-objects/tipo-descuento.enum';
import {
  PromotionNotFoundException,
  InvalidPromotionStateException,
} from '../../domain/exceptions/domain.exception';

describe('Application Layer: CreatePromocionReglaUseCase', () => {
  let mockPromocionReglaRepo: jest.Mocked<PromocionReglaRepositoryInterface>;
  let mockPromocionRepo: jest.Mocked<PromocionRepositoryInterface>;

  beforeEach(() => {
    mockPromocionReglaRepo = {
      create: jest.fn(),
      findByPromocionId: jest.fn(),
      findById: jest.fn(),
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
  });

  it('debe crear una regla de promoción reactivamente si la promoción es válida', (done) => {
    const useCase = new CreatePromocionReglaUseCase(mockPromocionReglaRepo, mockPromocionRepo);

    const dto = {
      promocionId: 1,
      diasSemana: 'LUN,MAR,MIE',
      horaInicio: '09:00:00',
      horaFin: '18:00:00',
      limiteUsosPorTicket: 2,
    };

    const existingPromo = new Promocion({
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

    const savedRegla = new PromocionRegla(
      5,
      dto.promocionId,
      dto.diasSemana,
      dto.horaInicio,
      dto.horaFin,
      dto.limiteUsosPorTicket
    );

    mockPromocionRepo.findById.mockReturnValue(of(existingPromo));
    mockPromocionReglaRepo.create.mockReturnValue(of(savedRegla));

    useCase.execute(dto).subscribe({
      next: (res) => {
        expect(res.id).toBe(5);
        expect(res.promocionId).toBe(1);
        expect(res.diasSemana).toBe('LUN,MAR,MIE');
        expect(res.limiteUsosPorTicket).toBe(2);
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe fallar si la promoción no existe', (done) => {
    const useCase = new CreatePromocionReglaUseCase(mockPromocionReglaRepo, mockPromocionRepo);
    mockPromocionRepo.findById.mockReturnValue(of(null));

    useCase
      .execute({
        promocionId: 999,
        diasSemana: 'LUN',
      })
      .subscribe({
        next: () => done.fail('No debió crear la regla'),
        error: (err) => {
          expect(err).toBeInstanceOf(PromotionNotFoundException);
          done();
        },
      });
  });

  it('debe fallar si la promoción está en estado Finalizada', (done) => {
    const useCase = new CreatePromocionReglaUseCase(mockPromocionReglaRepo, mockPromocionRepo);

    const finalizadaPromo = new Promocion({
      id: 1,
      nombre: 'Promo Finalizada',
      tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01'),
      fechaFin: new Date('2026-08-31'),
      productoIds: [1],
      estadoPromocionId: EstadoPromocionEnum.FINALIZADA,
      activa: false,
    });

    mockPromocionRepo.findById.mockReturnValue(of(finalizadaPromo));

    useCase
      .execute({
        promocionId: 1,
        diasSemana: 'LUN',
      })
      .subscribe({
        next: () => done.fail('No debió permitir modificar'),
        error: (err) => {
          expect(err).toBeInstanceOf(InvalidPromotionStateException);
          done();
        },
      });
  });
});
