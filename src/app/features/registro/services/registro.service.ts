import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Registro } from '../models/registro.interface';
import { CreateRegistroDto } from '../models/create-registro.dto';
import { UpdateRegistroDto } from '../models/update-registro.dto';

@Injectable({ providedIn: 'root' })
export class RegistroService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/registros`;

    getAll(): Observable<Registro[]> { return this.http.get<Registro[]>(this.url); }
    getById(id: string): Observable<Registro> { return this.http.get<Registro>(`${this.url}/${id}`); }
    create(dto: CreateRegistroDto): Observable<Registro> { return this.http.post<Registro>(this.url, dto); }
    update(id: string, dto: UpdateRegistroDto): Observable<Registro> { return this.http.patch<Registro>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
    completar(id: string, observaciones: string): Observable<Registro> { return this.http.patch<Registro>(`${this.url}/${id}/completar`, { observaciones }); }
    rechazar(id: string, motivo: string): Observable<Registro> { return this.http.patch<Registro>(`${this.url}/${id}/rechazar`, { motivo }); }
}
