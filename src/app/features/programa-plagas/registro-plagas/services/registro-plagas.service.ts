import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroPlagas } from '../models/registro-plagas';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
const BASE = environment.apiUrl + '/registros-plagas'; // Ajusta la URL base según tu configuración de API
@Injectable({
    providedIn: 'root'
})
export class RegistroPlagasService {
    constructor(private http: HttpClient) {}
        listar(): Observable<RegistroPlagas[]> {
        return this.http.get<RegistroPlagas[]>(BASE);
    }
 
    listarPorPrograma(programaPlagasId: string): Observable<RegistroPlagas[]> {
        return this.http.get<RegistroPlagas[]>(`${BASE}/programa/${programaPlagasId}`);
    }
 
    obtener(id: string): Observable<RegistroPlagas> {
        return this.http.get<RegistroPlagas>(`${BASE}/${id}`);
    }
 
    crear(data: Partial<RegistroPlagas>): Observable<RegistroPlagas> {
        return this.http.post<RegistroPlagas>(BASE, data);
    }
 
    actualizar(id: string, data: Partial<RegistroPlagas>): Observable<RegistroPlagas> {
        return this.http.patch<RegistroPlagas>(`${BASE}/${id}`, data);
    }
 
    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }
}
