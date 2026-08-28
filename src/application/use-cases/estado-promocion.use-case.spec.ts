import { of } from 'rxjs';
import { ListEstadoPromocionUseCase } from './list-estado-promocion.use-case';
import { EstadoPromocionRepositoryInterface } from '../../domain/repositories/estado-promocion.repository.interface';
import { EstadoPromocion } from '../../domain/entities/estado-promocion.entity';

describe('Application Layer: ListEstadoPromocionUseCase', () => {
  let mockRepository: jest.Mocked<EstadoPromocionRepositoryInterface>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
  });

  it('debe listar los estados de promoción y emitir los DTOs correspondientes', (done) => {
    const useCase = new ListEstadoPromocionUseCase(mockRepository);

    const mockData: EstadoPromocion[] = [
      new EstadoPromocion(1, 'Programada', 'Promoción aún no vigente', true),
      new EstadoPromocion(2, 'Activa', 'Promoción vigente', true),
      new EstadoPromocion(3, 'Finalizada', 'Promoción culminada', true),
    ];

    mockRepository.findAll.mockReturnValue(of(mockData));

    useCase.execute().subscribe({
      next: (response) => {
        expect(response).toHaveLength(3);
        expect(response[0].id).toBe(1);
        expect(response[0].nombre).toBe('Programada');
        expect(response[1].id).toBe(2);
        expect(response[1].nombre).toBe('Activa');
        expect(response[2].id).toBe(3);
        expect(response[2].nombre).toBe('Finalizada');
        done();
      },
      error: (err) => done(err),
    });
  });
});
