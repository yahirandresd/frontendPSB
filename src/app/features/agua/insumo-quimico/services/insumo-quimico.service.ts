import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { InsumoQuimico, CreateInsumoQuimicoDto, UpdateInsumoQuimicoDto } from '../models/insumo-quimico.interface';

@Injectable({ providedIn: 'root' })
export class InsumoQuimicoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/insumo-quimico`;
    getAll(): Observable<InsumoQuimico[]> { return this.http.get<InsumoQuimico[]>(this.url); }
    getById(id: string): Observable<InsumoQuimico> { return this.http.get<InsumoQuimico>(`${this.url}/${id}`); }
    create(dto: CreateInsumoQuimicoDto): Observable<InsumoQuimico> { return this.http.post<InsumoQuimico>(this.url, dto); }
    update(id: string, dto: UpdateInsumoQuimicoDto): Observable<InsumoQuimico> { return this.http.patch<InsumoQuimico>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
