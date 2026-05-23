
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiagnosticoInicial } from '../models/diagnostico-inicial';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

const BASE = environment.apiUrl + '/diagnostico-plagas';

@Injectable({ providedIn: 'root' })
export class DiagnosticoPlagasService {
    constructor(private http: HttpClient) {}

    listar(): Observable<DiagnosticoInicial[]> {
        return this.http.get<DiagnosticoInicial[]>(BASE);
    }

    listarPorPrograma(programaId: string): Observable<DiagnosticoInicial[]> {
        return this.http.get<DiagnosticoInicial[]>(`${BASE}/programa/${programaId}`);
    }

    obtener(id: string): Observable<DiagnosticoInicial> {
        return this.http.get<DiagnosticoInicial>(`${BASE}/${id}`);
    }

    crear(data: Partial<DiagnosticoInicial>): Observable<DiagnosticoInicial> {
        return this.http.post<DiagnosticoInicial>(BASE, data);
    }

    actualizar(id: string, data: Partial<DiagnosticoInicial>): Observable<DiagnosticoInicial> {
        return this.http.patch<DiagnosticoInicial>(`${BASE}/${id}`, data);
    }

    eliminar(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }
}