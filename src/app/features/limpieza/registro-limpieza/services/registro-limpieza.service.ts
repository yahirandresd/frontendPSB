import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { RegistroLimpieza } from '../models/registro-limpieza.interface';
import { CreateRegistroLimpiezaDto } from '../models/create-registro-limpieza.dto';
import { UpdateRegistroLimpiezaDto } from '../models/update-registro-limpieza.dto';

@Injectable({ providedIn: 'root' })
export class RegistroLimpiezaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/registros-limpieza`;

    getAll(): Observable<RegistroLimpieza[]>                                  { return this.http.get<RegistroLimpieza[]>(this.url); }
    getById(id: string): Observable<RegistroLimpieza>                         { return this.http.get<RegistroLimpieza>(`${this.url}/${id}`); }
    getByPrograma(programaId: string): Observable<RegistroLimpieza[]>         { return this.http.get<RegistroLimpieza[]>(`${this.url}/por-programa/${programaId}`); }
    create(dto: CreateRegistroLimpiezaDto): Observable<RegistroLimpieza>      { return this.http.post<RegistroLimpieza>(this.url, dto); }
    update(id: string, dto: UpdateRegistroLimpiezaDto): Observable<RegistroLimpieza> { return this.http.patch<RegistroLimpieza>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void>                                      { return this.http.delete<void>(`${this.url}/${id}`); }
}
