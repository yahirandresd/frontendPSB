import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { FuenteAgua, CreateFuenteAguaDto, UpdateFuenteAguaDto } from '../models/fuente-agua.interface';

@Injectable({ providedIn: 'root' })
export class FuenteAguaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/fuente-agua`;
    getAll(): Observable<FuenteAgua[]> { return this.http.get<FuenteAgua[]>(this.url); }
    getById(id: string): Observable<FuenteAgua> { return this.http.get<FuenteAgua>(`${this.url}/${id}`); }
    create(dto: CreateFuenteAguaDto): Observable<FuenteAgua> { return this.http.post<FuenteAgua>(this.url, dto); }
    update(id: string, dto: UpdateFuenteAguaDto): Observable<FuenteAgua> { return this.http.patch<FuenteAgua>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
