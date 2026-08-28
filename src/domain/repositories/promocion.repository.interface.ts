import { Observable } from 'rxjs';
import { Promocion } from '../entities/promocion.entity';

export interface ResumenConteoEstados {
  programada: number;
  activa: number;
  finalizada: number;
  total: number;
}

export interface ResumenVigencia {
  totalVigentes: number;
  fechaInicioFiltro: string;
  fechaFinFiltro: string;
  promociones: Promocion[];
}

export interface PromocionRepositoryInterface {
  create(promocion: Promocion): Observable<Promocion>;
  findAll(): Observable<Promocion[]>;
  findById(id: number): Observable<Promocion | null>;
  update(promocion: Promocion): Observable<Promocion>;
  delete(id: number): Observable<boolean>;
  countByEstado(): Observable<ResumenConteoEstados>;
  countVigentes(fechaInicio: Date, fechaFin: Date, fechaReferencia?: Date): Observable<ResumenVigencia>;
}
