import { of } from 'rxjs';
import { PromocionCategoriaController } from './promocion-categoria.controller';
import { CreatePromocionCategoriaUseCase } from '../../../../../application/use-cases/create-promocion-categoria.use-case';
import { CreatePromocionCategoriaDto } from '../../../../../application/dtos/create-promocion-categoria.dto';

describe('Infrastructure Controller: PromocionCategoriaController', () => {
  let controller: PromocionCategoriaController;
  let mockUseCase: jest.Mocked<CreatePromocionCategoriaUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreatePromocionCategoriaUseCase>;
    controller = new PromocionCategoriaController(mockUseCase);
  });

  it('debe asociar una categoría a la promoción', (done) => {
    const dto: CreatePromocionCategoriaDto = {
      promocionId: 1,
      categoriaId: 2,
    };

    const mockResponse = {
      promocionId: 1,
      categoriaId: 2,
    };

    mockUseCase.execute.mockReturnValue(of(mockResponse));

    controller.create(dto).subscribe({
      next: (res) => {
        expect(res).toEqual(mockResponse);
        expect(mockUseCase.execute).toHaveBeenCalledWith(dto);
        done();
      },
      error: (err) => done(err),
    });
  });
});
