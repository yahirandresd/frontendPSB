import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ProgramaLimpieza } from '../models/programa-limpieza.interface';
import { CreateProgramaLimpiezaDto } from '../models/create-programa-limpieza.dto';
import { UpdateProgramaLimpiezaDto } from '../models/update-programa-limpieza.dto';

@Injectable({ providedIn: 'root' })
export class ProgramaLimpiezaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/programas-limpieza`;

    getAll(): Observable<ProgramaLimpieza[]> {
        return this.http.get<ProgramaLimpieza[]>(this.url);
    }

    getById(id: string): Observable<ProgramaLimpieza> {
        return this.http.get<ProgramaLimpieza>(`${this.url}/${id}`);
    }

    getByPrograma(programaId: string): Observable<ProgramaLimpieza[]> {
        return this.http.get<ProgramaLimpieza[]>(`${this.url}/por-programa/${programaId}`);
    }

    create(dto: CreateProgramaLimpiezaDto): Observable<ProgramaLimpieza> {
        return this.http.post<ProgramaLimpieza>(this.url, dto);
    }

    update(id: string, dto: UpdateProgramaLimpiezaDto): Observable<ProgramaLimpieza> {
        return this.http.patch<ProgramaLimpieza>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
