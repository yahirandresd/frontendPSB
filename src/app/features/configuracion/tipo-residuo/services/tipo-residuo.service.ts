import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { TipoResiduo } from '../models/tipo-residuo.interface';
import { CreateTipoResiduoDto } from '../models/create-tipo-residuo.dto';
import { UpdateTipoResiduoDto } from '../models/update-tipo-residuo.dto';

@Injectable({ providedIn: 'root' })
export class TipoResiduoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/tipo-residuo`;

    getAll(): Observable<TipoResiduo[]> {
        return this.http.get<TipoResiduo[]>(this.url);
    }

    getById(id: string): Observable<TipoResiduo> {
        return this.http.get<TipoResiduo>(`${this.url}/${id}`);
    }

    create(dto: CreateTipoResiduoDto): Observable<TipoResiduo> {
        return this.http.post<TipoResiduo>(this.url, dto);
    }

    update(id: string, dto: UpdateTipoResiduoDto): Observable<TipoResiduo> {
        return this.http.patch<TipoResiduo>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
