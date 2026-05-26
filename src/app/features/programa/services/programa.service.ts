import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Programa } from '../models/programa.interface';
import { CreateProgramaDto } from '../models/create-programa.dto';
import { UpdateProgramaDto } from '../models/update-programa.dto';

@Injectable({ providedIn: 'root' })
export class ProgramaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/programas`;

    getAll(): Observable<Programa[]> { return this.http.get<Programa[]>(this.url); }
    getByPlanId(planPsbId: string): Observable<Programa[]> { return this.http.get<Programa[]>(`${this.url}?planPsbId=${planPsbId}`); }
    getById(id: string): Observable<Programa> { return this.http.get<Programa>(`${this.url}/${id}`); }
    create(dto: CreateProgramaDto): Observable<Programa> { return this.http.post<Programa>(this.url, dto); }
    update(id: string, dto: UpdateProgramaDto): Observable<Programa> { return this.http.patch<Programa>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
