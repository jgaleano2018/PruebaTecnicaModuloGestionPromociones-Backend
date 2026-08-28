import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductoRepositoryInterface } from '../../domain/repositories/producto.repository.interface';
import { ProductoResponseDto } from '../dtos/producto-response.dto';
import { ProductoMapper } from '../mappers/producto.mapper';
import { ListProductoUseCasePort } from '../ports/input/list-producto.use-case.port';

export class ListProductoUseCase implements ListProductoUseCasePort {
  constructor(private readonly productoRepository: ProductoRepositoryInterface) {}

  public execute(): Observable<ProductoResponseDto[]> {
    return this.productoRepository
      .findAll()
      .pipe(map((productos) => ProductoMapper.toListResponseDto(productos)));
  }
}
