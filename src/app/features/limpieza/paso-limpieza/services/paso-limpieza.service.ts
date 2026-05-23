import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { PasoLimpieza } from '../models/paso-limpieza.interface';
import { CreatePasoLimpiezaDto } from '../models/create-paso-limpieza.dto';
import { UpdatePasoLimpiezaDto } from '../models/update-paso-limpieza.dto';

@Injectable({ providedIn: 'root' })
export class PasoLimpiezaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/pasos-limpieza`;

    getAll(): Observable<PasoLimpieza[]> {
        return this.http.get<PasoLimpieza[]>(this.url);
    }

    getById(id: string): Observable<PasoLimpieza> {
        return this.http.get<PasoLimpieza>(`${this.url}/${id}`);
    }

    getByPrograma(programaLimpiezaId: string): Observable<PasoLimpieza[]> {
        return this.http.get<PasoLimpieza[]>(`${this.url}/por-programa-limpieza/${programaLimpiezaId}`);
    }

    create(dto: CreatePasoLimpiezaDto): Observable<PasoLimpieza> {
        return this.http.post<PasoLimpieza>(this.url, dto);
    }

    update(id: string, dto: UpdatePasoLimpiezaDto): Observable<PasoLimpieza> {
        return this.http.patch<PasoLimpieza>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
