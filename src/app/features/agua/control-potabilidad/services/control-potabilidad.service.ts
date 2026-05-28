import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ControlPotabilidad, CreateControlPotabilidadDto, UpdateControlPotabilidadDto } from '../models/control-potabilidad.interface';

@Injectable({ providedIn: 'root' })
export class ControlPotabilidadService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/control-diario-potabilidad`;
    getAll(): Observable<ControlPotabilidad[]> { return this.http.get<ControlPotabilidad[]>(this.url); }
    getByRegistro(registroAguaId: string): Observable<ControlPotabilidad[]> { return this.http.get<ControlPotabilidad[]>(`${this.url}/registro/${registroAguaId}`); }
    getById(id: string): Observable<ControlPotabilidad> { return this.http.get<ControlPotabilidad>(`${this.url}/${id}`); }
    create(dto: CreateControlPotabilidadDto): Observable<ControlPotabilidad> { return this.http.post<ControlPotabilidad>(this.url, dto); }
    update(id: string, dto: UpdateControlPotabilidadDto): Observable<ControlPotabilidad> { return this.http.patch<ControlPotabilidad>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
