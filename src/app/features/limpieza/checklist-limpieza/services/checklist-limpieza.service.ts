import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ChecklistLimpieza } from '../models/checklist-limpieza.interface';
import { CreateChecklistLimpiezaDto } from '../models/create-checklist-limpieza.dto';
import { UpdateChecklistLimpiezaDto } from '../models/update-checklist-limpieza.dto';

@Injectable({ providedIn: 'root' })
export class ChecklistLimpiezaService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/checklist-limpieza`;

    getByRegistro(registroLimpiezaId: string): Observable<ChecklistLimpieza[]>          { return this.http.get<ChecklistLimpieza[]>(`${this.url}/por-registro-limpieza/${registroLimpiezaId}`); }
    getById(id: string): Observable<ChecklistLimpieza>                                  { return this.http.get<ChecklistLimpieza>(`${this.url}/${id}`); }
    create(dto: CreateChecklistLimpiezaDto): Observable<ChecklistLimpieza>              { return this.http.post<ChecklistLimpieza>(this.url, dto); }
    update(id: string, dto: UpdateChecklistLimpiezaDto): Observable<ChecklistLimpieza>  { return this.http.patch<ChecklistLimpieza>(`${this.url}/${id}`, dto); }
    delete(id: string): Observable<void>                                                { return this.http.delete<void>(`${this.url}/${id}`); }
}
