import { of } from 'rxjs';
import { PromocionController } from './promocion.controller';
import { CreatePromocionUseCase } from '../../../../../application/use-cases/create-promocion.use-case';
import { ListPromocionesUseCase } from '../../../../../application/use-cases/list-promociones.use-case';
import { ChangeEstadoPromocionUseCase } from '../../../../../application/use-cases/change-estado-promocion.use-case';
import { DeletePromocionUseCase } from '../../../../../application/use-cases/delete-promocion.use-case';
import { GetResumenEstadosUseCase } from '../../../../../application/use-cases/get-resumen-estados.use-case';
import { GetResumenVigentesUseCase } from '../../../../../application/use-cases/get-resumen-vigentes.use-case';
import { CreatePromocionDto } from '../../../../../application/dtos/create-promocion.dto';
import { PromocionResponseDto } from '../../../../../application/dtos/promocion-response.dto';

describe('Infrastructure Controller: PromocionController', () => {
  let controller: PromocionController;
  let mockCreateUseCase: jest.Mocked<CreatePromocionUseCase>;
  let mockListUseCase: jest.Mocked<ListPromocionesUseCase>;
  let mockChangeEstadoUseCase: jest.Mocked<ChangeEstadoPromocionUseCase>;
  let mockDeleteUseCase: jest.Mocked<DeletePromocionUseCase>;
  let mockGetResumenEstadosUseCase: jest.Mocked<GetResumenEstadosUseCase>;
  let mockGetResumenVigentesUseCase: jest.Mocked<GetResumenVigentesUseCase>;

  beforeEach(() => {
    mockCreateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreatePromocionUseCase>;
    mockListUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListPromocionesUseCase>;
    mockChangeEstadoUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ChangeEstadoPromocionUseCase>;
    mockDeleteUseCase = { execute: jest.fn() } as unknown as jest.Mocked<DeletePromocionUseCase>;
    mockGetResumenEstadosUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GetResumenEstadosUseCase>;
    mockGetResumenVigentesUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GetResumenVigentesUseCase>;

    controller = new PromocionController(
      mockCreateUseCase,
      mockListUseCase,
      mockChangeEstadoUseCase,
      mockDeleteUseCase,
      mockGetResumenEstadosUseCase,
      mockGetResumenVigentesUseCase
    );
  });

  it('debe delegar la creación al caso de uso correspondiente', (done) => {
    const dto: CreatePromocionDto = {
      nombre: 'Promo Controller',
      tipoDescuentoId: 1,
      valorDescuento: 20,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      productoIds: [1],
    };

    const mockResponse: PromocionResponseDto = {
      id: 1,
      nombre: 'Promo Controller',
      descripcion: null,
      tipoDescuentoId: 1,
      tipoDescuentoNombre: 'Porcentaje',
      valorDescuento: 20,
      cantidadMinima: null,
      cantidadPagada: null,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      activa: false,
      estadoPromocionId: 1,
      estadoPromocionNombre: 'Programada',
      productoIds: [1],
      categoriaIds: [],
    };

    mockCreateUseCase.execute.mockReturnValue(of(mockResponse));

    controller.create(dto).subscribe({
      next: (res) => {
        expect(res).toEqual(mockResponse);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(dto);
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe delegar el listado de promociones', (done) => {
    mockListUseCase.execute.mockReturnValue(of([]));

    controller.findAll().subscribe({
      next: (res) => {
        expect(res).toEqual([]);
        expect(mockListUseCase.execute).toHaveBeenCalled();
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe delegar el cambio de estado con PATCH', (done) => {
    const mockResponse: PromocionResponseDto = {
      id: 1,
      nombre: 'Promo',
      descripcion: null,
      tipoDescuentoId: 1,
      tipoDescuentoNombre: 'Porcentaje',
      valorDescuento: 10,
      cantidadMinima: null,
      cantidadPagada: null,
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-31',
      activa: true,
      estadoPromocionId: 2,
      estadoPromocionNombre: 'Activa',
      productoIds: [],
      categoriaIds: [],
    };

    mockChangeEstadoUseCase.execute.mockReturnValue(of(mockResponse));

    controller.changeEstadoPatch(1, { estadoPromocionId: 2 }).subscribe({
      next: (res) => {
        expect(res.estadoPromocionId).toBe(2);
        expect(mockChangeEstadoUseCase.execute).toHaveBeenCalledWith(1, { estadoPromocionId: 2 });
        done();
      },
      error: (err) => done(err),
    });
  });

  it('debe delegar la eliminación de la promoción', (done) => {
    mockDeleteUseCase.execute.mockReturnValue(of({ success: true, message: 'Eliminada' }));

    controller.delete(1).subscribe({
      next: (res) => {
        expect(res.success).toBe(true);
        expect(mockDeleteUseCase.execute).toHaveBeenCalledWith(1);
        done();
      },
      error: (err) => done(err),
    });
  });
});
