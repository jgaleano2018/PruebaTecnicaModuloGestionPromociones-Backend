export class PromocionRegla {
  constructor(
    public readonly id?: number,
    public readonly promocionId?: number,
    public readonly diasSemana?: string | null,
    public readonly horaInicio?: string | null,
    public readonly horaFin?: string | null,
    public readonly limiteUsosPorTicket?: number | null
  ) {}
}
