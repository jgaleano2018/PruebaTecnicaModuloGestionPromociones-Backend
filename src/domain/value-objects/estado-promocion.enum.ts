export enum EstadoPromocionEnum {
  PROGRAMADA = 1,
  ACTIVA = 2,
  FINALIZADA = 3,
}

export const EstadoPromocionNombre: Record<EstadoPromocionEnum, string> = {
  [EstadoPromocionEnum.PROGRAMADA]: 'Programada',
  [EstadoPromocionEnum.ACTIVA]: 'Activa',
  [EstadoPromocionEnum.FINALIZADA]: 'Finalizada',
};
