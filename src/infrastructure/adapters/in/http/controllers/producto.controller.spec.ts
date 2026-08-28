import { of } from 'rxjs';
import { ProductoController } from './producto.controller';
import { ListProductoUseCase } from '../../../../../application/use-cases/list-producto.use-case';

describe('Infrastructure Controller: ProductoController', () => {
  let controller: ProductoController;
  let mockUseCase: jest.Mocked<ListProductoUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListProductoUseCase>;
    controller = new ProductoController(mockUseCase);
  });

  it('debe retornar lista de productos', (done) => {
    const mockList = [
      {
        id: 1,
        codigoBarras: '770100100001',
        nombre: 'Gaseosa Cola',
        descripcion: 'Bebida',
        precioVenta: 5000,
        precioCosto: 3000,
        stockActual: 100,
        categoriaId: 1,
        activo: true,
      },
    ];
    mockUseCase.execute.mockReturnValue(of(mockList));

    controller.findAll().subscribe({
      next: (res) => {
        expect(res).toEqual(mockList);
        expect(mockUseCase.execute).toHaveBeenCalled();
        done();
      },
      error: (err) => done(err),
    });
  });
});
