export class Categoria {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly descripcion: string | null = null,
    public readonly activo: boolean = true
  ) {}
}
