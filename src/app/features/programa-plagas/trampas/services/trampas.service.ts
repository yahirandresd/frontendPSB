import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trampa } from '../models/trampa';
import { environment } from '@/environments/environment';

const BASE = environment.apiUrl + '/trampas';

@Injectable({
    providedIn: 'root'
})
export class TrampasService {
    constructor(private http: HttpClient) {}
        listar(): Observable<Trampa[]> { return this.http.get<Trampa[]>(BASE); }
    listarPorArea(areaId: string): Observable<Trampa[]> {
        return this.http.get<Trampa[]>(`${BASE}/area/${areaId}`);
    }
    obtener(id: string): Observable<Trampa> { return this.http.get<Trampa>(`${BASE}/${id}`); }
    crear(data: Partial<Trampa>): Observable<Trampa> { return this.http.post<Trampa>(BASE, data); }
    actualizar(id: string, data: Partial<Trampa>): Observable<Trampa> {
        return this.http.patch<Trampa>(`${BASE}/${id}`, data);
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
