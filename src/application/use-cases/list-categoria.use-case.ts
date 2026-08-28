import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriaRepositoryInterface } from '../../domain/repositories/categoria.repository.interface';
import { CategoriaResponseDto } from '../dtos/categoria-response.dto';
import { CategoriaMapper } from '../mappers/categoria.mapper';
import { ListCategoriaUseCasePort } from '../ports/input/list-categoria.use-case.port';

export class ListCategoriaUseCase implements ListCategoriaUseCasePort {
  constructor(private readonly categoriaRepository: CategoriaRepositoryInterface) {}

  public execute(): Observable<CategoriaResponseDto[]> {
    return this.categoriaRepository
      .findAll()
      .pipe(map((categorias) => CategoriaMapper.toListResponseDto(categorias)));
  }
}
