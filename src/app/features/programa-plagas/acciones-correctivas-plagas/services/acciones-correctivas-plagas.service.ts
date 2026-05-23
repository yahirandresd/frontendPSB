import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccionCorrectivaPlagas } from '../models/accion-correctiva-plagas';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
const BASE = environment.apiUrl + '/acciones-correctivas'; // Ajusta la URL base según tu configuración de API

@Injectable({
    providedIn: 'root'
})
export class AccionesCorrectivasPlagasService {
    constructor(private http: HttpClient) {}
    listar(): Observable<AccionCorrectivaPlagas[]> { 
        return this.http.get<AccionCorrectivaPlagas[]>(BASE); 
    }
    listarPorHallazgo(hallazgoId: string): Observable<AccionCorrectivaPlagas[]> {
        return this.http.get<AccionCorrectivaPlagas[]>(`${BASE}/hallazgo/${hallazgoId}`);
    }
    obtener(id: string): Observable<AccionCorrectivaPlagas> { 
        return this.http.get<AccionCorrectivaPlagas>(`${BASE}/${id}`); 
    }
    crear(data: Partial<AccionCorrectivaPlagas>): Observable<AccionCorrectivaPlagas> {
        return this.http.post<AccionCorrectivaPlagas>(BASE, data);
    }
    actualizar(id: string, data: Partial<AccionCorrectivaPlagas>): Observable<AccionCorrectivaPlagas> {
        return this.http.patch<AccionCorrectivaPlagas>(`${BASE}/${id}`, data);
    }
    cerrar(id: string): Observable<AccionCorrectivaPlagas> {
        return this.http.patch<AccionCorrectivaPlagas>(`${BASE}/${id}/cerrar`, {});
    }
    eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
}
