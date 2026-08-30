import { of, throwError } from 'rxjs';
import { CreatePromocionUseCase } from './create-promocion.use-case';
import { ListPromocionesUseCase } from './list-promociones.use-case';
import { ChangeEstadoPromocionUseCase } from './change-estado-promocion.use-case';
import { DeletePromocionUseCase } from './delete-promocion.use-case';
import { GetResumenEstadosUseCase } from './get-resumen-estados.use-case';
import { GetResumenVigentesUseCase } from './get-resumen-vigentes.use-case';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromocionCategoriaRepositoryInterface } from '../../domain/repositories/promocion-categoria.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { PromocionCategoria } from '../../domain/entities/promocion-categoria.entity';
import { EstadoPromocionEnum } from '../../domain/value-objects/estado-promocion.enum';
import { TipoDescuentoEnum } from '../../domain/value-objects/tipo-descuento.enum';
import {
  PromotionNotFoundException,
  BusinessRuleValidationException,
} from '../../domain/exceptions/domain.exception';

describe('Application Layer: Reactive Use Cases', () => {
  let mockRepository: jest.Mocked<PromocionRepositoryInterface>;
  let mockPromocionCategoriaRepository: jest.Mocked<PromocionCategoriaRepositoryInterface>;

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

    mockPromocionCategoriaRepository = {
      create: jest.fn(),
      findByPromocionId: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreatePromocionUseCase', () => {
    it('debe ejecutar la creación y emitir el DTO mapeado reactivamente', (done) => {
      const useCase = new CreatePromocionUseCase(mockRepository, mockPromocionCategoriaRepository);
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

  describe('ListPromocionesUseCase', () => {
    it('debe listar todas las promociones y emitir los DTOs correspondientes', (done) => {
      const useCase = new ListPromocionesUseCase(mockRepository);
      const mockList = [
        new Promocion({
          id: 1,
          nombre: 'Promo 1',
          tipoDescuentoId: 1,
          valorDescuento: 10,
          fechaInicio: new Date('2026-08-01'),
          fechaFin: new Date('2026-08-31'),
          productoIds: [1],
          estadoPromocionId: EstadoPromocionEnum.PROGRAMADA,
          activa: false,
        }),
      ];

      mockRepository.findAll.mockReturnValue(of(mockList));

      useCase.execute().subscribe({
        next: (res) => {
          expect(res).toHaveLength(1);
          expect(res[0].id).toBe(1);
          expect(res[0].nombre).toBe('Promo 1');
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

  describe('GetResumenEstadosUseCase', () => {
    it('debe retornar conteo de promociones por estado', (done) => {
      const useCase = new GetResumenEstadosUseCase(mockRepository);
      const mockConteo = {
        programada: 2,
        activa: 3,
        finalizada: 5,
        total: 10,
      };

      mockRepository.countByEstado.mockReturnValue(of(mockConteo));

      useCase.execute().subscribe({
        next: (res) => {
          expect(res.programada).toBe(2);
          expect(res.activa).toBe(3);
          expect(res.finalizada).toBe(5);
          expect(res.total).toBe(10);
          done();
        },
        error: (err) => done(err),
      });
    });
  });

  describe('GetResumenVigentesUseCase', () => {
    it('debe retornar el resumen de promociones vigentes para fechas válidas', (done) => {
      const useCase = new GetResumenVigentesUseCase(mockRepository);
      const query = {
        fechaInicio: '2026-08-01T00:00:00.000Z',
        fechaFin: '2026-08-31T23:59:59.000Z',
      };

      const mockVigentes = {
        totalVigentes: 1,
        fechaInicioFiltro: query.fechaInicio,
        fechaFinFiltro: query.fechaFin,
        promociones: [
          new Promocion({
            id: 1,
            nombre: 'Promo Vigente',
            tipoDescuentoId: 1,
            valorDescuento: 10,
            fechaInicio: new Date('2026-08-01'),
            fechaFin: new Date('2026-08-31'),
            productoIds: [1],
            estadoPromocionId: EstadoPromocionEnum.ACTIVA,
            activa: true,
          }),
        ],
      };

      mockRepository.countVigentes.mockReturnValue(of(mockVigentes));

      useCase.execute(query).subscribe({
        next: (res) => {
          expect(res.totalVigentes).toBe(1);
          expect(res.promociones).toHaveLength(1);
          expect(res.promociones[0].nombre).toBe('Promo Vigente');
          done();
        },
        error: (err) => done(err),
      });
    });

    it('debe fallar si fechaFin es menor a fechaInicio', (done) => {
      const useCase = new GetResumenVigentesUseCase(mockRepository);
      const query = {
        fechaInicio: '2026-08-31T00:00:00.000Z',
        fechaFin: '2026-08-01T00:00:00.000Z',
      };

      useCase.execute(query).subscribe({
        next: () => done.fail('No debió ejecutar consulta'),
        error: (err) => {
          expect(err).toBeInstanceOf(BusinessRuleValidationException);
          done();
        },
      });
    });
  });
});
