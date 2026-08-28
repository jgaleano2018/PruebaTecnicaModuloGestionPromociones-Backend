import { PromocionMapper } from './promocion.mapper';
import { Promocion } from '../../domain/entities/promocion.entity';
import { Producto } from '../../domain/entities/producto.entity';
import { Categoria } from '../../domain/entities/categoria.entity';
import { PromocionRegla } from '../../domain/entities/promocion-regla.entity';
import { CreatePromocionDto } from '../dtos/create-promocion.dto';

describe('Application Mapper: PromocionMapper', () => {
  it('debe transformar CreatePromocionDto a entidad de Dominio Promocion', () => {
    const dto: CreatePromocionDto = {
      nombre: 'Promo Mapper',
      descripcion: 'Descuento especial',
      tipoDescuentoId: 1,
      valorDescuento: 25,
      cantidadMinima: 2,
      cantidadPagada: 1,
      fechaInicio: '2026-08-01T00:00:00.000Z',
      fechaFin: '2026-08-31T23:59:59.000Z',
      productoIds: [1, 2],
      categoriaIds: [3],
      reglas: [
        {
          diasSemana: 'LUN,MAR',
          horaInicio: '08:00:00',
          horaFin: '18:00:00',
          limiteUsosPorTicket: 2,
        },
      ],
    };

    const domain = PromocionMapper.toDomain(dto);
    expect(domain).toBeInstanceOf(Promocion);
    expect(domain.nombre).toBe('Promo Mapper');
    expect(domain.valorDescuento).toBe(25);
    expect(domain.productoIds).toEqual([1, 2]);
    expect(domain.categoriaIds).toEqual([3]);
    expect(domain.reglas).toHaveLength(1);
    expect(domain.reglas[0].diasSemana).toBe('LUN,MAR');
  });

  it('debe transformar entidad de Dominio Promocion a PromocionResponseDto con relaciones', () => {
    const domain = new Promocion({
      id: 5,
      nombre: 'Promo Dominio',
      descripcion: 'Detalle',
      tipoDescuentoId: 1,
      valorDescuento: 15,
      cantidadMinima: 1,
      cantidadPagada: 1,
      fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
      fechaFin: new Date('2026-08-31T23:59:59.000Z'),
      activa: true,
      estadoPromocionId: 2,
      productoIds: [1],
      categoriaIds: [2],
      productos: [
        new Producto(1, '770100100001', 'Gaseosa', 'Bebida', 5000, 3000, 50, 2, true),
      ],
      categorias: [new Categoria(2, 'Bebidas', 'Categoría', true)],
      reglas: [new PromocionRegla(1, 5, 'LUN', '08:00', '12:00', 1)],
    });

    const responseDto = PromocionMapper.toResponseDto(domain);
    expect(responseDto.id).toBe(5);
    expect(responseDto.nombre).toBe('Promo Dominio');
    expect(responseDto.tipoDescuentoNombre).toBe('Porcentaje');
    expect(responseDto.estadoPromocionNombre).toBe('Activa');
    expect(responseDto.productos).toHaveLength(1);
    expect(responseDto.productos![0].nombre).toBe('Gaseosa');
    expect(responseDto.categorias).toHaveLength(1);
    expect(responseDto.categorias![0].nombre).toBe('Bebidas');
    expect(responseDto.reglas).toHaveLength(1);
  });
});
