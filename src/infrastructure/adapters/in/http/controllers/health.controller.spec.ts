import { DataSource } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HealthController } from './health.controller';

describe('Infrastructure Controller: HealthController', () => {
  let controller: HealthController;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      isInitialized: true,
      query: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    controller = new HealthController(mockDataSource);
  });

  it('debe responder status UP cuando la base de datos está conectada', async () => {
    mockDataSource.query.mockResolvedValueOnce([{ alive: 1 }]);

    const response = await controller.check();
    expect(response.status).toBe('UP');
    expect(response.database).toBe('connected');
    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 AS alive');
  });

  it('debe lanzar HttpException con status 503 cuando la base de datos no está inicializada', async () => {
    Object.defineProperty(mockDataSource, 'isInitialized', { value: false });

    try {
      await controller.check();
      fail('Debió lanzar HttpException');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      const res = (error as HttpException).getResponse() as any;
      expect(res.status).toBe('DOWN');
      expect(res.database).toBe('disconnected');
    }
  });

  it('debe lanzar HttpException con status 503 cuando la consulta a base de datos falla', async () => {
    mockDataSource.query.mockRejectedValueOnce(new Error('Connection lost'));

    try {
      await controller.check();
      fail('Debió lanzar HttpException');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      const res = (error as HttpException).getResponse() as any;
      expect(res.status).toBe('DOWN');
      expect(res.database).toBe('disconnected');
    }
  });
});
