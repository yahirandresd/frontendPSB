import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ProgramaPlagas } from '../models/programa-plagas';

const BASE = environment.apiUrl + '/programas-plagas';

@Injectable({
    providedIn: 'root'
})
export class ProgramaPlagasService {
    constructor(private http: HttpClient) {}

    listar(): Observable<ProgramaPlagas[]> {
        return this.http.get<ProgramaPlagas[]>(BASE);
    }

    obtener(id: string): Observable<ProgramaPlagas> {
        return this.http.get<ProgramaPlagas>(`${BASE}/${id}`);
    }

    crear(data: Partial<ProgramaPlagas>): Observable<ProgramaPlagas> {
        return this.http.post<ProgramaPlagas>(BASE, data);
    }

    actualizar(id: string, data: Partial<ProgramaPlagas>): Observable<ProgramaPlagas> {
        return this.http.patch<ProgramaPlagas>(`${BASE}/${id}`, data);
    }

    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }

    obtenerEstadisticas(id: string): Observable<{
        totalRegistros: number;
        totalHallazgos: number;
        totalTrampas: number;
        totalAcciones: number;
        totalAreas: number;
        totalPlaguicidas: number;
    }> {
        return this.http.get<any>(`${BASE}/${id}/estadisticas`);
    }
}
