import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  BusinessRuleValidationException,
  PromotionNotFoundException,
  InvalidPromotionStateException,
} from '../../../../../domain/exceptions/domain.exception';

describe('Infrastructure Filter: DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const mockResponse = {
      status: mockStatus,
    };
    const mockRequest = {
      url: '/api/v1/promociones',
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('debe capturar BusinessRuleValidationException y responder 400', () => {
    const exception = new BusinessRuleValidationException('Validación fallida');
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: 'BusinessRuleValidationException',
        message: 'Validación fallida',
        path: '/api/v1/promociones',
      })
    );
  });

  it('debe capturar PromotionNotFoundException y responder 404', () => {
    const exception = new PromotionNotFoundException(99);
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        error: 'PromotionNotFoundException',
        message: expect.stringContaining('99'),
      })
    );
  });

  it('debe capturar InvalidPromotionStateException y responder 422', () => {
    const exception = new InvalidPromotionStateException('Estado inválido');
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 422,
        error: 'InvalidPromotionStateException',
        message: 'Estado inválido',
      })
    );
  });
});
