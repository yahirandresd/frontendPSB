import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Usuario } from '../models/usuario.interface';
import { CreateUsuarioDto } from '../models/create-usuario.dto';
import { UpdateUsuarioDto } from '../models/update-usuario.dto';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/users`;

    getAll(): Observable<Usuario[]>              { return this.http.get<Usuario[]>(this.url); }
    getById(id: string): Observable<Usuario>    { return this.http.get<Usuario>(`${this.url}/${id}`); }
    create(dto: CreateUsuarioDto): Observable<Usuario>             { return this.http.post<Usuario>(this.url, dto); }
    update(id: string, dto: UpdateUsuarioDto): Observable<Usuario> { return this.http.patch<Usuario>(`${this.url}/${id}`, dto); }
}
