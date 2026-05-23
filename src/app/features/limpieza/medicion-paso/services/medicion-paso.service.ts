import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { MedicionPaso } from '../models/medicion-paso.interface';
import { CreateMedicionPasoDto } from '../models/create-medicion-paso.dto';
import { UpdateMedicionPasoDto } from '../models/update-medicion-paso.dto';

@Injectable({ providedIn: 'root' })
export class MedicionPasoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/medicion-paso`;

    getAll(): Observable<MedicionPaso[]>                                        { return this.http.get<MedicionPaso[]>(this.url); }
    getById(id: string): Observable<MedicionPaso>                               { return this.http.get<MedicionPaso>(`${this.url}/${id}`); }
    getByChecklist(checklistId: string): Observable<MedicionPaso[]>             { return this.http.get<MedicionPaso[]>(`${this.url}/por-checklist/${checklistId}`); }
    create(dto: CreateMedicionPasoDto): Observable<MedicionPaso>                { return this.http.post<MedicionPaso>(this.url, dto); }
    update(id: string, dto: UpdateMedicionPasoDto): Observable<MedicionPaso>    { return this.http.patch<MedicionPaso>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void>                                        { return this.http.delete<void>(`${this.url}/${id}`); }
}
