import { of } from 'rxjs';
import { EstadoPromocionController } from './estado-promocion.controller';
import { ListEstadoPromocionUseCase } from '../../../../../application/use-cases/list-estado-promocion.use-case';

describe('Infrastructure Controller: EstadoPromocionController', () => {
  let controller: EstadoPromocionController;
  let mockUseCase: jest.Mocked<ListEstadoPromocionUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListEstadoPromocionUseCase>;
    controller = new EstadoPromocionController(mockUseCase);
  });

  it('debe retornar lista de estados de promoción', (done) => {
    const mockList = [
      { id: 1, nombre: 'Programada', descripcion: 'No vigente', activo: true },
      { id: 2, nombre: 'Activa', descripcion: 'Vigente', activo: true },
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
