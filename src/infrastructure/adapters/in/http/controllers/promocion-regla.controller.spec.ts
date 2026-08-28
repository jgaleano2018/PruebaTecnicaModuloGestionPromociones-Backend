import { of } from 'rxjs';
import { PromocionReglaController } from './promocion-regla.controller';
import { CreatePromocionReglaUseCase } from '../../../../../application/use-cases/create-promocion-regla.use-case';
import { CreatePromocionReglaDto } from '../../../../../application/dtos/create-promocion-regla.dto';

describe('Infrastructure Controller: PromocionReglaController', () => {
  let controller: PromocionReglaController;
  let mockUseCase: jest.Mocked<CreatePromocionReglaUseCase>;

  beforeEach(() => {
    mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreatePromocionReglaUseCase>;
    controller = new PromocionReglaController(mockUseCase);
  });

  it('debe crear una regla de promoción', (done) => {
    const dto: CreatePromocionReglaDto = {
      promocionId: 1,
      diasSemana: 'LUN,MAR',
      horaInicio: '08:00',
      horaFin: '18:00',
      limiteUsosPorTicket: 2,
    };

    const mockResponse = {
      id: 1,
      promocionId: 1,
      diasSemana: 'LUN,MAR',
      horaInicio: '08:00',
      horaFin: '18:00',
      limiteUsosPorTicket: 2,
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
