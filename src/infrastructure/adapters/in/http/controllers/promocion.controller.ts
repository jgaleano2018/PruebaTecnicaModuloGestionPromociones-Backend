import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreatePromocionDto } from '../../../../../application/dtos/create-promocion.dto';
import { UpdateEstadoPromocionDto } from '../../../../../application/dtos/update-estado-promocion.dto';
import { QueryVigenciaDto } from '../../../../../application/dtos/query-vigencia.dto';
import { PromocionResponseDto } from '../../../../../application/dtos/promocion-response.dto';
import { ResumenConteoEstadosDto } from '../../../../../application/dtos/promocion-resumen-estado.dto';
import { ResumenVigenciaDto } from '../../../../../application/dtos/promocion-resumen-vigencia.dto';
import { DeletePromocionResponseDto } from '../../../../../application/use-cases/delete-promocion.use-case';
import { CreatePromocionUseCase } from '../../../../../application/use-cases/create-promocion.use-case';
import { ListPromocionesUseCase } from '../../../../../application/use-cases/list-promociones.use-case';
import { ChangeEstadoPromocionUseCase } from '../../../../../application/use-cases/change-estado-promocion.use-case';
import { DeletePromocionUseCase } from '../../../../../application/use-cases/delete-promocion.use-case';
import { GetResumenEstadosUseCase } from '../../../../../application/use-cases/get-resumen-estados.use-case';
import { GetResumenVigentesUseCase } from '../../../../../application/use-cases/get-resumen-vigentes.use-case';

@ApiTags('Promociones')
@Controller('promociones')
export class PromocionController {
  constructor(
    private readonly createPromocionUseCase: CreatePromocionUseCase,
    private readonly listPromocionesUseCase: ListPromocionesUseCase,
    private readonly changeEstadoPromocionUseCase: ChangeEstadoPromocionUseCase,
    private readonly deletePromocionUseCase: DeletePromocionUseCase,
    private readonly getResumenEstadosUseCase: GetResumenEstadosUseCase,
    private readonly getResumenVigentesUseCase: GetResumenVigentesUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una promoción',
    description:
      'Crea una nueva promoción comercial con sus reglas, productos y categorías. Aplica validaciones de negocio.',
  })
  @ApiBody({ type: CreatePromocionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Promoción creada exitosamente',
    type: PromocionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validaciones de negocio o esquema fallaron',
  })
  public create(@Body() dto: CreatePromocionDto): Observable<PromocionResponseDto> {
    return this.createPromocionUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las promociones',
    description: 'Retorna todas las promociones registradas con sus relaciones y datos principales.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de promociones obtenida exitosamente',
    type: [PromocionResponseDto],
  })
  public findAll(): Observable<PromocionResponseDto[]> {
    return this.listPromocionesUseCase.execute();
  }

  @Get('resumen/conteo-estados')
  @ApiOperation({
    summary: 'Contador simple por estado',
    description:
      'Retorna el total de promociones agrupadas por Programada, Activa y Finalizada.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conteo por estados obtenido exitosamente',
    type: ResumenConteoEstadosDto,
  })
  public getResumenEstados(): Observable<ResumenConteoEstadosDto> {
    return this.getResumenEstadosUseCase.execute();
  }

  @Get('resumen/vigentes')
  @ApiOperation({
    summary: 'Consulta de promociones vigentes hoy',
    description:
      'Filtra las promociones activas cuya vigencia abarca la fecha actual y caen dentro del rango recibido.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumen de promociones vigentes obtenido exitosamente',
    type: ResumenVigenciaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fechas de filtro inválidas',
  })
  public getResumenVigentes(@Query() query: QueryVigenciaDto): Observable<ResumenVigenciaDto> {
    return this.getResumenVigentesUseCase.execute(query);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Cambiar el estado de una promoción (PATCH)',
    description:
      'Flujo estricto de transición: Programada -> Activa -> Finalizada. Una promoción Finalizada no puede modificarse.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la promoción' })
  @ApiBody({ type: UpdateEstadoPromocionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado cambiado exitosamente',
    type: PromocionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Promoción no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Transición de estado inválida',
  })
  public changeEstadoPatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoPromocionDto
  ): Observable<PromocionResponseDto> {
    return this.changeEstadoPromocionUseCase.execute(id, dto);
  }

  @Put(':id/estado')
  @ApiOperation({
    summary: 'Cambiar el estado de una promoción (PUT)',
    description:
      'Flujo estricto de transición: Programada -> Activa -> Finalizada. Una promoción Finalizada no puede modificarse.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la promoción' })
  @ApiBody({ type: UpdateEstadoPromocionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado cambiado exitosamente',
    type: PromocionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Promoción no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Transición de estado inválida',
  })
  public changeEstadoPut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoPromocionDto
  ): Observable<PromocionResponseDto> {
    return this.changeEstadoPromocionUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una promoción',
    description:
      'Elimina una promoción solo si se encuentra en estado "Programada" (1).',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la promoción a eliminar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Promoción eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Promoción no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Solo se pueden eliminar promociones en estado Programada',
  })
  public delete(@Param('id', ParseIntPipe) id: number): Observable<DeletePromocionResponseDto> {
    return this.deletePromocionUseCase.execute(id);
  }
}
