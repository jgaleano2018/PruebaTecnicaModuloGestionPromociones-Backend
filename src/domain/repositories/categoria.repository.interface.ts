import { Observable } from 'rxjs';
import { Categoria } from '../entities/categoria.entity';

export interface CategoriaRepositoryInterface {
  findAll(): Observable<Categoria[]>;
  findByIds(ids: number[]): Observable<Categoria[]>;
}
