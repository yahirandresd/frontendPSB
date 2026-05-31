import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface DashboardStats {
    planesActivos: number;
    totalPlanes: number;
    planesEnRevision: number;
    cumplimientoGeneral: number;
    registrosDelMes: number;
    registrosPendientes: number;
    alertasActivas: number;
}

export interface PlanResumen {
    id: string;
    nombre: string;
    version: string;
    nivelRiesgo: string;
    estado: string;
    cumplimiento: number;
    vencimiento: string;
}

export interface ActividadItem {
    id: string;
    operario: string;
    iniciales: string;
    programa: string;
    accion: string;
    estado: string;
    tiempo: string;
    tieneFoto: boolean;
}

export interface CumplimientoPrograma {
    programa: string;
    porcentaje: number;
}

export interface DashboardResponse {
    stats: DashboardStats;
    planes: PlanResumen[];
    actividadReciente: ActividadItem[];
    cumplimientoPorPrograma: CumplimientoPrograma[];
    tendenciaMensual: {
        meses: string[];
        series: { programa: string; datos: number[] }[];
    };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/dashboard`;

    getDashboard(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(this.url);
    }
}
