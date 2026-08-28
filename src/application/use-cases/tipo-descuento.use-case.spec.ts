import { of } from 'rxjs';
import { ListTipoDescuentoUseCase } from './list-tipo-descuento.use-case';
import { TipoDescuentoRepositoryInterface } from '../../domain/repositories/tipo-descuento.repository.interface';
import { TipoDescuento } from '../../domain/entities/tipo-descuento.entity';

describe('Application Layer: ListTipoDescuentoUseCase', () => {
  let mockRepository: jest.Mocked<TipoDescuentoRepositoryInterface>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
  });

  it('debe listar los tipos de descuento y emitir los DTOs correspondientes', (done) => {
    const useCase = new ListTipoDescuentoUseCase(mockRepository);

    const mockData: TipoDescuento[] = [
      new TipoDescuento(1, 'Porcentaje', 'Descuento %', true),
      new TipoDescuento(2, 'Monto Fijo', 'Descuento valor fijo', true),
    ];

    mockRepository.findAll.mockReturnValue(of(mockData));

    useCase.execute().subscribe({
      next: (response) => {
        expect(response).toHaveLength(2);
        expect(response[0].id).toBe(1);
        expect(response[0].nombre).toBe('Porcentaje');
        expect(response[1].id).toBe(2);
        expect(response[1].nombre).toBe('Monto Fijo');
        done();
      },
      error: (err) => done(err),
    });
  });
});
