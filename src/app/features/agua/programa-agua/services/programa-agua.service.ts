import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ProgramaAgua } from '../models/programa-agua.interface';
import { CreateProgramaAguaDto } from '../models/create-programa-agua.dto';
import { UpdateProgramaAguaDto } from '../models/update-programa-agua.dto';

@Injectable({ providedIn: 'root' })
export class ProgramaAguaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/programa-agua`;

    getAll(): Observable<ProgramaAgua[]> {
        return this.http.get<ProgramaAgua[]>(this.url);
    }

    getById(id: string): Observable<ProgramaAgua> {
        return this.http.get<ProgramaAgua>(`${this.url}/${id}`);
    }

    create(dto: CreateProgramaAguaDto): Observable<ProgramaAgua> {
        return this.http.post<ProgramaAgua>(this.url, dto);
    }

    update(id: string, dto: UpdateProgramaAguaDto): Observable<ProgramaAgua> {
        return this.http.patch<ProgramaAgua>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
