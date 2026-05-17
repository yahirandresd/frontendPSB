import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { TipoAlimento } from '../models/tipo-alimento.interface';
import { CreateTipoAlimentoDto } from '../models/create-tipo-alimento.dto';
import { UpdateTipoAlimentoDto } from '../models/update-tipo-alimento.dto';

@Injectable({ providedIn: 'root' })
export class TipoAlimentoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/tipos-alimento`;

    getAll(): Observable<TipoAlimento[]> {
        return this.http.get<TipoAlimento[]>(this.url);
    }

    getById(id: string): Observable<TipoAlimento> {
        return this.http.get<TipoAlimento>(`${this.url}/${id}`);
    }

    create(dto: CreateTipoAlimentoDto): Observable<TipoAlimento> {
        return this.http.post<TipoAlimento>(this.url, dto);
    }

    update(id: string, dto: UpdateTipoAlimentoDto): Observable<TipoAlimento> {
        return this.http.patch<TipoAlimento>(`${this.url}/${id}`, dto);
    }
}
