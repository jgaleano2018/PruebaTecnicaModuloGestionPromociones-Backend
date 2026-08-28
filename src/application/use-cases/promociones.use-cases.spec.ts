import { of, throwError } from 'rxjs';
import { CreatePromocionUseCase } from './create-promocion.use-case';
import { ChangeEstadoPromocionUseCase } from './change-estado-promocion.use-case';
import { DeletePromocionUseCase } from './delete-promocion.use-case';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../../domain/value-objects/tipo-descuento.enum';
import { PromotionNotFoundException } from '../../domain/exceptions/domain.exception';

describe('Application Layer: Reactive Use Cases', () => {
  let mockRepository: jest.Mocked<PromocionRepositoryInterface>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countByEstado: jest.fn(),
      countVigentes: jest.fn(),
    };
  });

  describe('CreatePromocionUseCase', () => {
    it('debe ejecutar la creación y emitir el DTO mapeado reactivamente', (done) => {
      const useCase = new CreatePromocionUseCase(mockRepository);
      const dto = {
        nombre: 'Promo RxJS',
        tipoDescuentoId: 1,
        valorDescuento: 15,
        fechaInicio: '2026-08-01T00:00:00.000Z',
        fechaFin: '2026-08-31T23:59:59.000Z',
        productoIds: [1],
      };

      const domainSaved = new Promocion({
        id: 10,
        ...dto,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
        estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
        activa: false,
      });

      mockRepository.create.mockReturnValue(of(domainSaved));

      useCase.execute(dto).subscribe({
        next: (response) => {
          expect(response.id).toBe(10);
          expect(response.nombre).toBe('Promo RxJS');
          expect(response.tipoDescuentoNombre).toBe('Porcentaje');
          expect(response.estadoPromocionNombre).toBe('Programada');
          done();
        },
        error: (err) => done(err),
      });
    });
  });

  describe('ChangeEstadoPromocionUseCase', () => {
    it('debe cambiar estado y emitir respuesta actualizada', (done) => {
      const useCase = new ChangeEstadoPromocionUseCase(mockRepository);

      const existingPromocion = new Promocion({
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

      mockRepository.findById.mockReturnValue(of(existingPromocion));
      mockRepository.update.mockImplementation((promo) => of(promo));

      useCase.execute(1, { estadoPromocionId: EstadoPromocionEnum.ACTIVA }).subscribe({
        next: (res) => {
          expect(res.estadoPromocionId).toBe(EstadoPromocionEnum.ACTIVA);
          expect(res.activa).toBe(true);
          done();
        },
        error: (err) => done(err),
      });
    });

    it('debe emitir PromotionNotFoundException si el ID no existe', (done) => {
      const useCase = new ChangeEstadoPromocionUseCase(mockRepository);
      mockRepository.findById.mockReturnValue(of(null));

      useCase.execute(999, { estadoPromocionId: EstadoPromocionEnum.ACTIVA }).subscribe({
        next: () => done.fail('No debió emitir éxito'),
        error: (err) => {
          expect(err).toBeInstanceOf(PromotionNotFoundException);
          done();
        },
      });
    });
  });

  describe('DeletePromocionUseCase', () => {
    it('debe eliminar la promoción si está en estado Programada', (done) => {
      const useCase = new DeletePromocionUseCase(mockRepository);

      const existingPromocion = new Promocion({
        id: 1,
        nombre: 'Promo Borrar',
        tipoDescuentoId: TipoDescuentoEnum.PORCENTAJE,
        valorDescuento: 10,
        fechaInicio: new Date('2026-08-01'),
        fechaFin: new Date('2026-08-31'),
        productoIds: [1],
        estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
      });

      mockRepository.findById.mockReturnValue(of(existingPromocion));
      mockRepository.delete.mockReturnValue(of(true));

      useCase.execute(1).subscribe({
        next: (res) => {
          expect(res.success).toBe(true);
          expect(res.message).toContain('eliminada exitosamente');
          done();
        },
        error: (err) => done(err),
      });
    });
  });
});
