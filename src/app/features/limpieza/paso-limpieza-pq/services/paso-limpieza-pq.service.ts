import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { PasoLimpiezaPq } from '../models/paso-limpieza-pq.interface';
import { CreatePasoLimpiezaPqDto } from '../models/create-paso-limpieza-pq.dto';
import { UpdatePasoLimpiezaPqDto } from '../models/update-paso-limpieza-pq.dto';

@Injectable({ providedIn: 'root' })
export class PasoLimpiezaPqService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/pasos-limpieza-pq`;

    getAll(): Observable<PasoLimpiezaPq[]>                              { return this.http.get<PasoLimpiezaPq[]>(this.url); }
    getById(id: string): Observable<PasoLimpiezaPq>                    { return this.http.get<PasoLimpiezaPq>(`${this.url}/${id}`); }
    getByPaso(pasoId: string): Observable<PasoLimpiezaPq[]>            { return this.http.get<PasoLimpiezaPq[]>(`${this.url}/por-paso/${pasoId}`); }
    create(dto: CreatePasoLimpiezaPqDto): Observable<PasoLimpiezaPq>   { return this.http.post<PasoLimpiezaPq>(this.url, dto); }
    update(id: string, dto: UpdatePasoLimpiezaPqDto): Observable<PasoLimpiezaPq> { return this.http.patch<PasoLimpiezaPq>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void>                               { return this.http.delete<void>(`${this.url}/${id}`); }
}
