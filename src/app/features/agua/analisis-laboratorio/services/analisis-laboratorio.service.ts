import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { AnalisisLaboratorio, CreateAnalisisLaboratorioDto, UpdateAnalisisLaboratorioDto } from '../models/analisis-laboratorio.interface';

@Injectable({ providedIn: 'root' })
export class AnalisisLaboratorioService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/analisis-laboratorio`;
    getAll(): Observable<AnalisisLaboratorio[]> { return this.http.get<AnalisisLaboratorio[]>(this.url); }
    getById(id: string): Observable<AnalisisLaboratorio> { return this.http.get<AnalisisLaboratorio>(`${this.url}/${id}`); }
    create(dto: CreateAnalisisLaboratorioDto): Observable<AnalisisLaboratorio> { return this.http.post<AnalisisLaboratorio>(this.url, dto); }
    update(id: string, dto: UpdateAnalisisLaboratorioDto): Observable<AnalisisLaboratorio> { return this.http.patch<AnalisisLaboratorio>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
