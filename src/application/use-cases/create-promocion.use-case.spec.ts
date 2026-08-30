import { of, throwError } from 'rxjs';
import { CreatePromocionUseCase } from './create-promocion.use-case';
import { PromocionRepositoryInterface } from '../../domain/repositories/promocion.repository.interface';
import { PromocionCategoriaRepositoryInterface } from '../../domain/repositories/promocion-categoria.repository.interface';
import { Promocion } from '../../domain/entities/promocion.entity';
import { PromocionCategoria } from '../../domain/entities/promocion-categoria.entity';
import { CreatePromocionDto } from '../dtos/create-promocion.dto';

describe('Application UseCase: CreatePromocionUseCase', () => {
  let useCase: CreatePromocionUseCase;
  let mockPromocionRepository: jest.Mocked<PromocionRepositoryInterface>;
  let mockPromocionCategoriaRepository: jest.Mocked<PromocionCategoriaRepositoryInterface>;

  beforeEach(() => {
    mockPromocionRepository = {
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

    useCase = new CreatePromocionUseCase(
      mockPromocionRepository,
      mockPromocionCategoriaRepository
    );
  });

  it('debe crear una promocion correctamente con categorias', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Descuento Verano',
      descripcion: '20% de descuento',
      tipoDescuentoId: 1,
      valorDescuento: 20,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      categoriaIds: [1, 2],
      productoIds: [],
    };

    const createdPromocion = new Promocion({
      id: 1,
      nombre: 'Descuento Verano',
      descripcion: '20% de descuento',
      tipoDescuentoId: 1,
      valorDescuento: 20,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      estadoPromocionId: 1,
      activa: false,
      categoriaIds: [1, 2],
      productoIds: [],
    });

    mockPromocionRepository.create.mockReturnValue(of(createdPromocion));
    mockPromocionCategoriaRepository.create.mockReturnValue(
      of(new PromocionCategoria(1, 1))
    );

    useCase.execute(dto).subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.nombre).toBe('Descuento Verano');
        expect(result.categoriaIds).toEqual([1, 2]);
        expect(mockPromocionRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledTimes(2);
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            promocionId: 1,
            categoriaId: 1,
          })
        );
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            promocionId: 1,
            categoriaId: 2,
          })
        );
        done();
      },
      error: done.fail,
    });
  });

  it('debe crear una promocion sin categorias (categoriaIds vacio)', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Descuento Simple',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      productoIds: [1],
      categoriaIds: [],
    };

    const createdPromocion = new Promocion({
      id: 2,
      nombre: 'Descuento Simple',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      estadoPromocionId: 1,
      activa: false,
      productoIds: [1],
      categoriaIds: [],
    });

    mockPromocionRepository.create.mockReturnValue(of(createdPromocion));

    useCase.execute(dto).subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.id).toBe(2);
        expect(result.nombre).toBe('Descuento Simple');
        expect(mockPromocionRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPromocionCategoriaRepository.create).not.toHaveBeenCalled();
        done();
      },
      error: done.fail,
    });
  });

  it('debe crear una promocion sin categorias (categoriaIds undefined)', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Descuento sin categorias',
      tipoDescuentoId: 1,
      valorDescuento: 15,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      productoIds: [1, 2],
    };

    const createdPromocion = new Promocion({
      id: 3,
      nombre: 'Descuento sin categorias',
      tipoDescuentoId: 1,
      valorDescuento: 15,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      estadoPromocionId: 1,
      activa: false,
      productoIds: [1, 2],
      categoriaIds: [],
    });

    mockPromocionRepository.create.mockReturnValue(of(createdPromocion));

    useCase.execute(dto).subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.id).toBe(3);
        expect(mockPromocionRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPromocionCategoriaRepository.create).not.toHaveBeenCalled();
        done();
      },
      error: done.fail,
    });
  });

  it('debe propagar error cuando falla la creacion de la promocion', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Promocion Error',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      categoriaIds: [1],
      productoIds: [],
    };

    const error = new Error('Database error');
    mockPromocionRepository.create.mockReturnValue(throwError(() => error));

    useCase.execute(dto).subscribe({
      next: () => done.fail('Should have thrown an error'),
      error: (err) => {
        expect(err).toBe(error);
        expect(mockPromocionRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPromocionCategoriaRepository.create).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('debe propagar error cuando falla la insercion de promocion-categoria', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Promocion con error en categoria',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      categoriaIds: [1, 2],
      productoIds: [],
    };

    const createdPromocion = new Promocion({
      id: 4,
      nombre: 'Promocion con error en categoria',
      tipoDescuentoId: 1,
      valorDescuento: 10,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      estadoPromocionId: 1,
      activa: false,
      categoriaIds: [1, 2],
      productoIds: [],
    });

    const error = new Error('Error inserting promocion-categoria');

    mockPromocionRepository.create.mockReturnValue(of(createdPromocion));
    mockPromocionCategoriaRepository.create.mockReturnValue(
      throwError(() => error)
    );

    useCase.execute(dto).subscribe({
      next: () => done.fail('Should have thrown an error'),
      error: (err) => {
        expect(err).toBe(error);
        expect(mockPromocionRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledTimes(2);
        done();
      },
    });
  });

  it('debe usar el id de la promocion creada para insertar en promocion-categoria', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Promocion con ID especifico',
      tipoDescuentoId: 1,
      valorDescuento: 25,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      categoriaIds: [5, 10, 15],
      productoIds: [],
    };

    const createdPromocion = new Promocion({
      id: 100,
      nombre: 'Promocion con ID especifico',
      tipoDescuentoId: 1,
      valorDescuento: 25,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      estadoPromocionId: 1,
      activa: false,
      categoriaIds: [5, 10, 15],
      productoIds: [],
    });

    mockPromocionRepository.create.mockReturnValue(of(createdPromocion));
    mockPromocionCategoriaRepository.create.mockImplementation(
      (pc: PromocionCategoria) => of(pc)
    );

    useCase.execute(dto).subscribe({
      next: (result) => {
        expect(result.id).toBe(100);
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledTimes(3);
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            promocionId: 100,
            categoriaId: 5,
          })
        );
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            promocionId: 100,
            categoriaId: 10,
          })
        );
        expect(mockPromocionCategoriaRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            promocionId: 100,
            categoriaId: 15,
          })
        );
        done();
      },
      error: done.fail,
    });
  });
});