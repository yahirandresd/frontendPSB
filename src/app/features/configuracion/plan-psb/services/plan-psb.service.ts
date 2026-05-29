import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { PlanPsb } from '../models/plan-psb.interface';
import { CreatePlanPsbDto } from '../models/create-plan-psb.dto';
import { UpdatePlanPsbDto } from '../models/update-plan-psb.dto';

@Injectable({ providedIn: 'root' })
export class PlanPsbService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/plan-psb`;

    getAll(): Observable<PlanPsb[]> {
        return this.http.get<PlanPsb[]>(this.url);
    }

    getById(id: string): Observable<PlanPsb> {
        return this.http.get<PlanPsb>(`${this.url}/${id}`);
    }

    create(dto: CreatePlanPsbDto): Observable<PlanPsb> {
        return this.http.post<PlanPsb>(this.url, dto);
    }

    update(id: string, dto: UpdatePlanPsbDto): Observable<PlanPsb> {
        return this.http.patch<PlanPsb>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
