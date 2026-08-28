import { of } from 'rxjs';
import { TipoDescuentoController } from './tipo-descuento.controller';
import { ListTipoDescuentoUseCase } from '../../../../../application/use-cases/list-tipo-descuento.use-case';

describe('Infrastructure Controller: TipoDescuentoController', () => {
  let controller: TipoDescuentoController;
  let mockUseCase: jest.Mocked<ListTipoDescuentoUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListTipoDescuentoUseCase>;
    controller = new TipoDescuentoController(mockUseCase);
  });

  it('debe retornar lista de tipos de descuento', (done) => {
    const mockList = [{ id: 1, nombre: 'Porcentaje', descripcion: 'Descuento %', activo: true }];
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
