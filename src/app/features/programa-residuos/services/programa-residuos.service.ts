import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import {
    ProgramaResiduo,
    RegistroResiduo,
    Recoleccion,
    ChecklistResiduo,
    EvidenciaResiduo,
    CreateProgramaResiduoDto,
    UpdateProgramaResiduoDto
} from '../models/programa-residuos.models';

@Injectable({ providedIn: 'root' })
export class ProgramaResiduosService {
    private http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;

    // --- PROGRAMAS DE RESIDUOS ---
    getProgramas(): Observable<ProgramaResiduo[]> {
        return this.http.get<ProgramaResiduo[]>(`${this.baseUrl}/programa-residuos`);
    }

    getProgramaById(id: string): Observable<ProgramaResiduo> {
        return this.http.get<ProgramaResiduo>(`${this.baseUrl}/programa-residuos/${id}`);
    }

    createPrograma(dto: CreateProgramaResiduoDto): Observable<ProgramaResiduo> {
        return this.http.post<ProgramaResiduo>(`${this.baseUrl}/programa-residuos`, dto);
    }

    updatePrograma(id: string, dto: UpdateProgramaResiduoDto): Observable<ProgramaResiduo> {
        return this.http.patch<ProgramaResiduo>(`${this.baseUrl}/programa-residuos/${id}`, dto);
    }

    deletePrograma(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/programa-residuos/${id}`);
    }

    // --- REGISTROS DE RESIDUOS (ACTIVIDADES) ---
    createRegistro(dto: {
        tipo_actividad: string;
        resultado_general: string;
        programaResiduoId: string;
        fecha?: string;
        observaciones?: string;
        responsable?: string;
        estado?: string;
    }): Observable<RegistroResiduo> {
        return this.http.post<RegistroResiduo>(`${this.baseUrl}/registro-residuos`, dto);
    }

    updateRegistro(id: string, dto: {
        tipo_actividad?: string;
        resultado_general?: string;
        fecha?: string;
        observaciones?: string;
        responsable?: string;
        estado?: string;
    }): Observable<RegistroResiduo> {
        return this.http.patch<RegistroResiduo>(`${this.baseUrl}/registro-residuos/${id}`, dto);
    }

    deleteRegistro(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/registro-residuos/${id}`);
    }

    // --- CHECKLIST ---
    updateChecklist(id: string, dto: {
        titulo?: string;
        descripcion?: string;
        porcentaje_cumplimiento?: number;
    }): Observable<ChecklistResiduo> {
        return this.http.patch<ChecklistResiduo>(`${this.baseUrl}/checklist-residuos/${id}`, dto);
    }

    // --- RECOLECCIONES ---
    updateRecoleccion(id: string, dto: Partial<Recoleccion>): Observable<Recoleccion> {
        return this.http.patch<Recoleccion>(`${this.baseUrl}/recoleccion/${id}`, dto);
    }

    // --- EVIDENCIAS ---
    createEvidencia(dto: {
        tipo_archivo: string;
        url: string;
        descripcion: string;
        fecha: string;
        registroResiduoId: string;
    }): Observable<EvidenciaResiduo> {
        return this.http.post<EvidenciaResiduo>(`${this.baseUrl}/evidencia-residuos`, dto);
    }

    uploadEvidencia(file: File, dto: {
        tipo_archivo: string;
        descripcion: string;
        fecha: string;
        registroResiduoId: string;
    }): Observable<EvidenciaResiduo> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('tipo_archivo', dto.tipo_archivo);
        formData.append('descripcion', dto.descripcion);
        formData.append('fecha', dto.fecha);
        formData.append('registroResiduoId', dto.registroResiduoId);
        return this.http.post<EvidenciaResiduo>(`${this.baseUrl}/evidencia-residuos/upload`, formData);
    }

    deleteEvidencia(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/evidencia-residuos/${id}`);
    }

    // Aliases for plan-defined program/residuo operations
    getProgramasResiduos(): Observable<ProgramaResiduo[]> {
        return this.getProgramas();
    }

    createProgramaBase(dto: Omit<CreateProgramaResiduoDto, 'objetivo' | 'alcance' | 'procedimiento_general'>): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/programas`, dto);
    }

    createProgramaResiduos(dto: CreateProgramaResiduoDto): Observable<ProgramaResiduo> {
        return this.createPrograma(dto);
    }

    updateProgramaBase(id: string, dto: Partial<CreateProgramaResiduoDto>): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/programas/${id}`, dto);
    }

    updateProgramaResiduos(id: string, dto: UpdateProgramaResiduoDto): Observable<ProgramaResiduo> {
        return this.updatePrograma(id, dto);
    }

    createRegistroBase(dto: { programaId: string; usuarioId: string; fecha: string; observaciones?: string; estado?: string }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/registros`, dto);
    }

    createRegistroResiduos(dto: {
        tipo_actividad: string;
        resultado_general: string;
        programaResiduoId: string;
        fecha?: string;
        observaciones?: string;
        responsable?: string;
        estado?: string;
    }): Observable<RegistroResiduo> {
        return this.createRegistro(dto);
    }

    updateRegistroBase(id: string, dto: { fecha?: string; observaciones?: string; estado?: string }): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/registros/${id}`, dto);
    }

    updateRegistroResiduo(id: string, dto: {
        tipo_actividad?: string;
        resultado_general?: string;
        fecha?: string;
        observaciones?: string;
        responsable?: string;
        estado?: string;
    }): Observable<RegistroResiduo> {
        return this.updateRegistro(id, dto);
    }

    deleteRegistroResiduo(id: string): Observable<void> {
        return this.deleteRegistro(id);
    }

    deleteRegistroBase(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/registros/${id}`);
    }

    createRecoleccion(dto: {
        fecha: string;
        responsable: string;
        cantidad_recolectada: number;
        observaciones?: string;
        registroResiduoId: string;
    }): Observable<Recoleccion> {
        return this.http.post<Recoleccion>(`${this.baseUrl}/recoleccion`, dto);
    }

    createChecklist(dto: {
        titulo: string;
        descripcion: string;
        porcentaje_cumplimiento: number;
        registroResiduoId: string;
    }): Observable<ChecklistResiduo> {
        return this.http.post<ChecklistResiduo>(`${this.baseUrl}/checklist-residuos`, dto);
    }
}
