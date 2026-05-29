import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Hallazgo } from '../models/hallazgo';
const BASE = environment.apiUrl + '/hallazgo-plagas'; // Ajusta la URL base según tu configuración de API

@Injectable({
    providedIn: 'root'
})
export class HallazgoService {
    constructor(private http: HttpClient) {}
        listar(): Observable<Hallazgo[]> {
        return this.http.get<Hallazgo[]>(BASE);
    }
 
    listarPorRegistro(registroPlagasId: string): Observable<Hallazgo[]> {
        return this.http.get<Hallazgo[]>(`${BASE}/registro/${registroPlagasId}`);
    }
 
    obtener(id: string): Observable<Hallazgo> {
        return this.http.get<Hallazgo>(`${BASE}/${id}`);
    }
 
    crear(data: Partial<Hallazgo>): Observable<Hallazgo> {
        return this.http.post<Hallazgo>(BASE, data);
    }
 
    actualizar(id: string, data: Partial<Hallazgo>): Observable<Hallazgo> {
        return this.http.patch<Hallazgo>(`${BASE}/${id}`, data);
    }
 
    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }
}
