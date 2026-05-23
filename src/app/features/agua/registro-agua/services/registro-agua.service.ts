import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { RegistroAgua, CreateRegistroAguaDto, UpdateRegistroAguaDto } from '../models/registro-agua.interface';

@Injectable({ providedIn: 'root' })
export class RegistroAguaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/registro-agua`;
    getAll(): Observable<RegistroAgua[]> { return this.http.get<RegistroAgua[]>(this.url); }
    getById(id: string): Observable<RegistroAgua> { return this.http.get<RegistroAgua>(`${this.url}/${id}`); }
    create(dto: CreateRegistroAguaDto): Observable<RegistroAgua> { return this.http.post<RegistroAgua>(this.url, dto); }
    update(id: string, dto: UpdateRegistroAguaDto): Observable<RegistroAgua> { return this.http.patch<RegistroAgua>(`${this.url}/${id}`, dto); }
    marcarConforme(id: string): Observable<RegistroAgua> { return this.http.patch<RegistroAgua>(`${this.url}/${id}/conforme`, {}); }
    marcarNoConforme(id: string): Observable<RegistroAgua> { return this.http.patch<RegistroAgua>(`${this.url}/${id}/no-conforme`, {}); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
