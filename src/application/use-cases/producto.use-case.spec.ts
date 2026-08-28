import { of } from 'rxjs';
import { ListProductoUseCase } from './list-producto.use-case';
import { ProductoRepositoryInterface } from '../../domain/repositories/producto.repository.interface';
import { Producto } from '../../domain/entities/producto.entity';

describe('Application Layer: ListProductoUseCase', () => {
  let mockRepository: jest.Mocked<ProductoRepositoryInterface>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
    };
  });

  it('debe listar los productos y emitir los DTOs correspondientes', (done) => {
    const useCase = new ListProductoUseCase(mockRepository);

    const mockData: Producto[] = [
      new Producto(1, '770100100001', 'Gaseosa Cola 1.5L', 'Bebida carbonatada', 5000, 3200, 150, 1, true),
      new Producto(2, '770100100002', 'Agua Mineral 600ml', 'Agua pura sin gas', 2500, 1200, 300, 1, true),
    ];

    mockRepository.findAll.mockReturnValue(of(mockData));

    useCase.execute().subscribe({
      next: (response) => {
        expect(response).toHaveLength(2);
        expect(response[0].id).toBe(1);
        expect(response[0].codigoBarras).toBe('770100100001');
        expect(response[0].nombre).toBe('Gaseosa Cola 1.5L');
        expect(response[0].precioVenta).toBe(5000);
        expect(response[1].id).toBe(2);
        expect(response[1].nombre).toBe('Agua Mineral 600ml');
        done();
      },
      error: (err) => done(err),
    });
  });
});
