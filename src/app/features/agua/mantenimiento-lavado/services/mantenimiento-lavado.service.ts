import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { MantenimientoLavado, CreateMantenimientoLavadoDto, UpdateMantenimientoLavadoDto } from '../models/mantenimiento-lavado.interface';

@Injectable({ providedIn: 'root' })
export class MantenimientoLavadoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/mantenimiento-lavado`;
    getAll(): Observable<MantenimientoLavado[]> { return this.http.get<MantenimientoLavado[]>(this.url); }
    getByRegistro(registroAguaId: string): Observable<MantenimientoLavado[]> { return this.http.get<MantenimientoLavado[]>(`${this.url}/registro/${registroAguaId}`); }
    getById(id: string): Observable<MantenimientoLavado> { return this.http.get<MantenimientoLavado>(`${this.url}/${id}`); }
    create(dto: CreateMantenimientoLavadoDto): Observable<MantenimientoLavado> { return this.http.post<MantenimientoLavado>(this.url, dto); }
    update(id: string, dto: UpdateMantenimientoLavadoDto): Observable<MantenimientoLavado> { return this.http.patch<MantenimientoLavado>(`${this.url}/${id}`, dto); }
    completar(id: string, observaciones: string): Observable<MantenimientoLavado> { return this.http.patch<MantenimientoLavado>(`${this.url}/${id}/completar`, { observaciones }); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
