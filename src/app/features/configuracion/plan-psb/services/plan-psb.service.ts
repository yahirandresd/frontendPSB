import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { PlanPSB } from '../models/plan-psb.interface';
import { CreatePlanPsbDto } from '../models/create-plan-psb.dto';

@Injectable({ providedIn: 'root' })
export class PlanPsbService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/planes-psb`;

    getAll(): Observable<PlanPSB[]> {
        return this.http.get<PlanPSB[]>(this.url);
    }

    getById(id: string): Observable<PlanPSB> {
        return this.http.get<PlanPSB>(`${this.url}/${id}`);
    }

    create(dto: CreatePlanPsbDto): Observable<PlanPSB> {
        return this.http.post<PlanPSB>(this.url, dto);
    }

    update(id: string, dto: Partial<CreatePlanPsbDto>): Observable<PlanPSB> {
        return this.http.patch<PlanPSB>(`${this.url}/${id}`, dto);
    }
}
