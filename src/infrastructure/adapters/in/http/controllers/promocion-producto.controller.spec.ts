import { of } from 'rxjs';
import { PromocionProductoController } from './promocion-producto.controller';
import { CreatePromocionProductoUseCase } from '../../../../../application/use-cases/create-promocion-producto.use-case';
import { CreatePromocionProductoDto } from '../../../../../application/dtos/create-promocion-producto.dto';

describe('Infrastructure Controller: PromocionProductoController', () => {
  let controller: PromocionProductoController;
  let mockUseCase: jest.Mocked<CreatePromocionProductoUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreatePromocionProductoUseCase>;
    controller = new PromocionProductoController(mockUseCase);
  });

  it('debe asociar un producto a la promoción', (done) => {
    const dto: CreatePromocionProductoDto = {
      promocionId: 1,
      productoId: 3,
    };

    const mockResponse = {
      promocionId: 1,
      productoId: 3,
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
