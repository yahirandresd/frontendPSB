import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { EquipoArea } from '../models/equipo-area.interface';
import { CreateEquipoAreaDto } from '../models/create-equipo-area.dto';
import { UpdateEquipoAreaDto } from '../models/update-equipo-area.dto';

@Injectable({ providedIn: 'root' })
export class EquipoAreaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/equipos-area`;

    getAll(): Observable<EquipoArea[]> {
        return this.http.get<EquipoArea[]>(this.url);
    }

    getById(id: string): Observable<EquipoArea> {
        return this.http.get<EquipoArea>(`${this.url}/${id}`);
    }

    getByEmpresa(empresaId: string): Observable<EquipoArea[]> {
        return this.http.get<EquipoArea[]>(`${this.url}/por-empresa/${empresaId}`);
    }

    create(dto: CreateEquipoAreaDto): Observable<EquipoArea> {
        return this.http.post<EquipoArea>(this.url, dto);
    }

    update(id: string, dto: UpdateEquipoAreaDto): Observable<EquipoArea> {
        return this.http.patch<EquipoArea>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
