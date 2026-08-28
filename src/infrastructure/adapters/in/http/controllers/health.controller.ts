import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({
    summary: 'Endpoint de Health Check',
    description:
      'Verifica el estado operativo de la API y su conectividad con Microsoft SQL Server.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio y base de datos operativas',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Servicio o base de datos no disponibles',
  })
  public async check() {
    try {
      if (!this.dataSource.isInitialized) {
        throw new HttpException(
          {
            status: 'DOWN',
            database: 'disconnected',
            message: 'Conexión a SQL Server no inicializada',
            timestamp: new Date().toISOString(),
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      await this.dataSource.query('SELECT 1 AS alive');

      return {
        status: 'UP',
        database: 'connected',
        message: 'Servicio y conexión a base de datos operativas',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'DOWN',
          database: 'disconnected',
          error: error.message || 'Error de conexión a la base de datos',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
