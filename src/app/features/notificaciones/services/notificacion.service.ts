import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Notificacion } from '../models/notificacion.interface';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/notifications`;

    getAll(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(this.url);
    }

    getById(id: string): Observable<Notificacion> {
        return this.http.get<Notificacion>(`${this.url}/${id}`);
    }

    getByUsuario(usuarioId: string): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}`);
    }

    getNoLeidas(usuarioId: string): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}`);
    }

    marcarLeida(id: string): Observable<Notificacion> {
        return this.http.patch<Notificacion>(`${this.url}/${id}/leer`, {});
    }

    update(id: string, dto: Partial<Notificacion>): Observable<Notificacion> {
        return this.http.patch<Notificacion>(`${this.url}/${id}`, dto);
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
