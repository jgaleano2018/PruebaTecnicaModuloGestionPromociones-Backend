import { of } from 'rxjs';
import { ListCategoriaUseCase } from './list-categoria.use-case';
import { CategoriaRepositoryInterface } from '../../domain/repositories/categoria.repository.interface';
import { Categoria } from '../../domain/entities/categoria.entity';

describe('Application Layer: ListCategoriaUseCase', () => {
  let mockRepository: jest.Mocked<CategoriaRepositoryInterface>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
    };
  });

  it('debe listar las categorías y emitir los DTOs correspondientes', (done) => {
    const useCase = new ListCategoriaUseCase(mockRepository);

    const mockData: Categoria[] = [
      new Categoria(1, 'Bebidas', 'Bebidas frías y calientes', true),
      new Categoria(2, 'Snacks', 'Papas y galletas', true),
    ];

    mockRepository.findAll.mockReturnValue(of(mockData));

    useCase.execute().subscribe({
      next: (response) => {
        expect(response).toHaveLength(2);
        expect(response[0].id).toBe(1);
        expect(response[0].nombre).toBe('Bebidas');
        expect(response[1].id).toBe(2);
        expect(response[1].nombre).toBe('Snacks');
        done();
      },
      error: (err) => done(err),
    });
  });
});
