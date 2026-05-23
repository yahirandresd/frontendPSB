import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Empresa } from '../models/empresa.interface';
import { CreateEmpresaDto } from '../models/create-empresa.dto';
import { UpdateEmpresaDto } from '../models/update-empresa.dto';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/empresas`;

    getAll(): Observable<Empresa[]> {
        return this.http.get<Empresa[]>(this.url);
    }

    getById(id: string): Observable<Empresa> {
        return this.http.get<Empresa>(`${this.url}/${id}`);
    }

    create(dto: CreateEmpresaDto): Observable<Empresa> {
        return this.http.post<Empresa>(this.url, dto);
    }

    update(id: string, dto: UpdateEmpresaDto): Observable<Empresa> {
        return this.http.patch<Empresa>(`${this.url}/${id}`, dto);
    }
}
