import { PromocionRegla } from '../../domain/entities/promocion-regla.entity';
import { CreatePromocionReglaDto } from '../dtos/create-promocion-regla.dto';
import { PromocionReglaResponseDto } from '../dtos/promocion-regla-response.dto';

export class PromocionReglaMapper {
  public static toDomain(dto: CreatePromocionReglaDto): PromocionRegla {
    return new PromocionRegla(
      undefined,
      dto.promocionId,
      dto.diasSemana ?? null,
      dto.horaInicio ?? null,
      dto.horaFin ?? null,
      dto.limiteUsosPorTicket ?? null
    );
  }

  public static toResponseDto(domain: PromocionRegla): PromocionReglaResponseDto {
    return {
      id: domain.id ?? 0,
      promocionId: domain.promocionId ?? 0,
      diasSemana: domain.diasSemana ?? null,
      horaInicio: domain.horaInicio ?? null,
      horaFin: domain.horaFin ?? null,
      limiteUsosPorTicket: domain.limiteUsosPorTicket ?? null,
    };
  }

  public static toListResponseDto(domains: PromocionRegla[]): PromocionReglaResponseDto[] {
    return domains.map((domain) => this.toResponseDto(domain));
  }
}
