export class Producto {
  constructor(
    public readonly id: number,
    public readonly codigoBarras: string,
    public readonly nombre: string,
    public readonly descripcion: string | null = null,
    public readonly precioVenta: number = 0,
    public readonly precioCosto: number = 0,
    public readonly stockActual: number = 0,
    public readonly categoriaId: number = 0,
    public readonly activo: boolean = true
  ) {}
}
