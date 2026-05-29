import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Plaguicida } from '../models/plaguicida';
const BASE = environment.apiUrl + '/plaguicida'
@Injectable({
    providedIn: 'root'
})
export class PlaguicidaService {
    constructor(private http: HttpClient) { }
    listar(): Observable<Plaguicida[]> { return this.http.get<Plaguicida[]>(BASE); }
    listarPorPrograma(programaPlagasId: string): Observable<Plaguicida[]> {
        return this.http.get<Plaguicida[]>(`${BASE}/programa/${programaPlagasId}`);
    }
    obtener(id: string): Observable<Plaguicida> { return this.http.get<Plaguicida>(`${BASE}/${id}`); }
    crear(data: Partial<Plaguicida>): Observable<Plaguicida> { return this.http.post<Plaguicida>(BASE, data); }
    actualizar(id: string, data: Partial<Plaguicida>): Observable<Plaguicida> {
        return this.http.patch<Plaguicida>(`${BASE}/${id}`, data);
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
