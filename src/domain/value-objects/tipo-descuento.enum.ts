export enum TipoDescuentoEnum {
  PORCENTAJE = 1,
  MONTO_FIJO = 2,
}

export const TipoDescuentoNombre: Record<TipoDescuentoEnum, string> = {
  [TipoDescuentoEnum.PORCENTAJE]: 'Porcentaje',
  [TipoDescuentoEnum.MONTO_FIJO]: 'Monto Fijo',
};
