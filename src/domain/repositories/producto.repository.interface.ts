import { Observable } from 'rxjs';
import { Producto } from '../entities/producto.entity';

export interface ProductoRepositoryInterface {
  findAll(): Observable<Producto[]>;
  findByIds(ids: number[]): Observable<Producto[]>;
}
