import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { AccionCorrectivaAgua, CreateAccionCorrectivaAguaDto, UpdateAccionCorrectivaAguaDto } from '../models/accion-correctiva-agua.interface';

@Injectable({ providedIn: 'root' })
export class AccionCorrectivaAguaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/acciones-correctivas-agua`;
    getAll(): Observable<AccionCorrectivaAgua[]> { return this.http.get<AccionCorrectivaAgua[]>(this.url); }
    getPendientes(): Observable<AccionCorrectivaAgua[]> { return this.http.get<AccionCorrectivaAgua[]>(`${this.url}/pendientes`); }
    getByRegistro(registroAguaId: string): Observable<AccionCorrectivaAgua[]> { return this.http.get<AccionCorrectivaAgua[]>(`${this.url}/registro/${registroAguaId}`); }
    getById(id: string): Observable<AccionCorrectivaAgua> { return this.http.get<AccionCorrectivaAgua>(`${this.url}/${id}`); }
    create(dto: CreateAccionCorrectivaAguaDto): Observable<AccionCorrectivaAgua> { return this.http.post<AccionCorrectivaAgua>(this.url, dto); }
    update(id: string, dto: UpdateAccionCorrectivaAguaDto): Observable<AccionCorrectivaAgua> { return this.http.patch<AccionCorrectivaAgua>(`${this.url}/${id}`, dto); }
    completar(id: string, resultadoVerificacion: string): Observable<AccionCorrectivaAgua> { return this.http.patch<AccionCorrectivaAgua>(`${this.url}/${id}/completar`, { resultadoVerificacion }); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
