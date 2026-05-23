import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoPlaga } from '../models/tipo-plaga';
import { environment } from '@/environments/environment';

const BASE = environment.apiUrl + '/tipo-plagas';

@Injectable({
    providedIn: 'root'
})
export class TipoPlagaService {
    constructor(private http: HttpClient) {}
        listar(): Observable<TipoPlaga[]> { return this.http.get<TipoPlaga[]>(BASE); }
    obtener(id: string): Observable<TipoPlaga> { return this.http.get<TipoPlaga>(`${BASE}/${id}`); }
    crear(data: Partial<TipoPlaga>): Observable<TipoPlaga> { return this.http.post<TipoPlaga>(BASE, data); }
    actualizar(id: string, data: Partial<TipoPlaga>): Observable<TipoPlaga> {
        return this.http.patch<TipoPlaga>(`${BASE}/${id}`, data);
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
