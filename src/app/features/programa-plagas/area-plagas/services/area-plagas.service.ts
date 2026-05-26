import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
const BASE = environment.apiUrl + '/area-plagas'; // Ajusta la URL base según tu configuración de API
import { Area } from '../models/area';

@Injectable({
    providedIn: 'root'
})
export class AreaPlagasService {
    constructor(private http: HttpClient) {}
        listar(): Observable<Area[]> {
        return this.http.get<Area[]>(BASE);
    }

    listarPorPrograma(programaPlagasId: string): Observable<Area[]> {
        return this.http.get<Area[]>(`${BASE}/programa/${programaPlagasId}`);
    }

    obtener(id: string): Observable<Area> {
        return this.http.get<Area>(`${BASE}/${id}`);
    }

    crear(data: Partial<Area>): Observable<Area> {
        return this.http.post<Area>(BASE, data);
    }

    actualizar(id: string, data: Partial<Area>): Observable<Area> {
        return this.http.patch<Area>(`${BASE}/${id}`, data);
    }

    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }
}
