import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cronograma } from '../models/cronograma';
import { environment } from '@/environments/environment.prod';
const BASE = environment.apiUrl + '/cronograma-plagas'; 
@Injectable({
    providedIn: 'root'
})
export class CronogramaService {
    constructor(private http: HttpClient) {}
    listar(): Observable<Cronograma[]> { return this.http.get<Cronograma[]>(BASE); }
    listarPorPrograma(programaId: string): Observable<Cronograma[]> {
        return this.http.get<Cronograma[]>(`${BASE}/programa/${programaId}`);
    }
    obtener(id: string): Observable<Cronograma> { return this.http.get<Cronograma>(`${BASE}/${id}`); }
    crear(data: Partial<Cronograma>): Observable<Cronograma> { return this.http.post<Cronograma>(BASE, data); }
    actualizar(id: string, data: Partial<Cronograma>): Observable<Cronograma> {
        return this.http.patch<Cronograma>(`${BASE}/${id}`, data);
    }
    marcarActividad(cronogramaId: string, actividadId: string, ejecutada: boolean): Observable<Cronograma> {
        return this.http.patch<Cronograma>(`${BASE}/${cronogramaId}/actividades/${actividadId}`, { ejecutada });
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
