import { Observable } from 'rxjs';
import { TipoDescuento } from '../entities/tipo-descuento.entity';

export interface TipoDescuentoRepositoryInterface {
  findAll(): Observable<TipoDescuento[]>;
  findById(id: number): Observable<TipoDescuento | null>;
}
