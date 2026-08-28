import { of } from 'rxjs';
import { CategoriaController } from './categoria.controller';
import { ListCategoriaUseCase } from '../../../../../application/use-cases/list-categoria.use-case';

describe('Infrastructure Controller: CategoriaController', () => {
  let controller: CategoriaController;
  let mockUseCase: jest.Mocked<ListCategoriaUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListCategoriaUseCase>;
    controller = new CategoriaController(mockUseCase);
  });

  it('debe retornar lista de categorías activas', (done) => {
    const mockList = [
      { id: 1, nombre: 'Bebidas', descripcion: 'Bebidas frías', activo: true },
      { id: 2, nombre: 'Snacks', descripcion: 'Snacks', activo: true },
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
