import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { VerificacionLimpieza } from '../models/verificacion-limpieza.interface';
import { CreateVerificacionLimpiezaDto } from '../models/create-verificacion-limpieza.dto';
import { UpdateVerificacionLimpiezaDto } from '../models/update-verificacion-limpieza.dto';

@Injectable({ providedIn: 'root' })
export class VerificacionLimpiezaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/verificaciones-limpieza`;

    getByRegistro(registroLimpiezaId: string): Observable<VerificacionLimpieza[]>               { return this.http.get<VerificacionLimpieza[]>(`${this.url}/por-registro-limpieza/${registroLimpiezaId}`); }
    getById(id: string): Observable<VerificacionLimpieza>                                      { return this.http.get<VerificacionLimpieza>(`${this.url}/${id}`); }
    create(dto: CreateVerificacionLimpiezaDto): Observable<VerificacionLimpieza>               { return this.http.post<VerificacionLimpieza>(this.url, dto); }
    update(id: string, dto: UpdateVerificacionLimpiezaDto): Observable<VerificacionLimpieza>   { return this.http.patch<VerificacionLimpieza>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void>                                                       { return this.http.delete<void>(`${this.url}/${id}`); }
}
