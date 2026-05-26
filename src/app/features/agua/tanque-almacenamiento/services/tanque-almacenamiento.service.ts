import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { TanqueAlmacenamiento, CreateTanqueAlmacenamientoDto, UpdateTanqueAlmacenamientoDto } from '../models/tanque-almacenamiento.interface';

@Injectable({ providedIn: 'root' })
export class TanqueAlmacenamientoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/tanque-almacenamiento`;
    getAll(): Observable<TanqueAlmacenamiento[]> { return this.http.get<TanqueAlmacenamiento[]>(this.url); }
    getById(id: string): Observable<TanqueAlmacenamiento> { return this.http.get<TanqueAlmacenamiento>(`${this.url}/${id}`); }
    create(dto: CreateTanqueAlmacenamientoDto): Observable<TanqueAlmacenamiento> { return this.http.post<TanqueAlmacenamiento>(this.url, dto); }
    update(id: string, dto: UpdateTanqueAlmacenamientoDto): Observable<TanqueAlmacenamiento> { return this.http.patch<TanqueAlmacenamiento>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
