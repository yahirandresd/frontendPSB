import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evidencia } from '../models/evidencia';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
const BASE = environment.apiUrl + '/evidencia-plagas';
@Injectable({
    providedIn: 'root'
})
export class EvidenciaPlagasService {
    constructor(private http: HttpClient) { }
    listar(): Observable<Evidencia[]> {
        return this.http.get<Evidencia[]>(BASE);
    }
    listarPorRegistro(registroId: string): Observable<Evidencia[]> {
        return this.http.get<Evidencia[]>(`${BASE}/registro/${registroId}`);
    }
    listarPorAccion(accionId: string): Observable<Evidencia[]> {
        return this.http.get<Evidencia[]>(`${BASE}/accion/${accionId}`);
    }
    obtener(id: string): Observable<Evidencia> {
        return this.http.get<Evidencia>(`${BASE}/${id}`);
    }
    crear(data: Partial<Evidencia>): Observable<Evidencia> {
        return this.http.post<Evidencia>(BASE, data);
    }
    actualizar(id: string, data: Partial<Evidencia>): Observable<Evidencia> {
        return this.http.patch<Evidencia>(`${BASE}/${id}`, data);
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
