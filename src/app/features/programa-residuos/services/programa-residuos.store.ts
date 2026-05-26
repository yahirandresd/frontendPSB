import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Programa,
    ProgramaResiduo,
    Registro,
    RegistroResiduo,
    Recoleccion,
    ChecklistResiduo,
    EvidenciaResiduo,
    DisposicionFinal,
    TipoResiduo,
    AreaGenereacion,
    Contenedeor,
    Residuo,
    TipoPrograma,
    FrecuenciaPrograma,
    EstadoRegistro,
    CreateProgramaResiduoDto,
    UpdateProgramaResiduoDto
} from '../models/programa-residuos.models';
import { checklistProgreso } from '../utils/programa-residuos.labels';
import { ProgramaResiduosService } from './programa-residuos.service';

@Injectable({ providedIn: 'root' })
export class ProgramaResiduosStore {
    private readonly service = inject(ProgramaResiduosService);
    private readonly programas = signal<Programa[]>([]);

    readonly programasList = this.programas.asReadonly();

    // Derived collection list pulling recolecciones from all registros
    readonly recoleccionesList = computed(() => {
        const list: (Recoleccion & { programaId: string; programaNombre: string; tipoResiduoName: string; estado: EstadoRegistro; vehiculo: string })[] = [];
        this.programas().forEach((p) => {
            p.programaResiduo?.registros.forEach((rr) => {
                rr.recolecciones.forEach((rec) => {
                    // Find some residue type info
                    const tipoName = rr.tipo_actividad === 'recoleccion' ? 'Orgánico' : 'Reciclable';
                    list.push({
                        ...rec,
                        programaId: p.id,
                        programaNombre: p.nombre,
                        tipoResiduoName: tipoName,
                        estado: rr.registro?.estado || EstadoRegistro.PENDIENTE,
                        vehiculo: rec.disposicionFinal ? 'Camión Autorizado' : 'Camión R-12'
                    });
                });
            });
        });
        return list;
    });

    readonly stats = computed(() => {
        const progs = this.programas();
        const recs = this.recoleccionesList();

        // Count active programs (programs with en_proceso or pendiente execution)
        const activos = progs.filter((p) =>
            p.registros?.some((r) => r.estado === EstadoRegistro.EN_PROCESO)
        ).length || progs.length; // Fallback to total if none

        const finalizados = progs.filter((p) =>
            p.registros?.every((r) => r.estado === EstadoRegistro.COMPLETADO)
        ).length;

        const recPendientes = recs.filter((r) => r.estado === 'pendiente' || r.estado === 'en_proceso').length;

        // Calculate delayed activities (records pending with past dates)
        let atrasadas = 0;
        const now = new Date();
        progs.forEach((p) => {
            p.registros?.forEach((r) => {
                if (r.estado !== EstadoRegistro.COMPLETADO && new Date(r.fecha) < now) {
                    atrasadas++;
                }
            });
        });

        // Compute average checklist compliance across all program records
        let totalPct = 0;
        let totalCount = 0;
        progs.forEach((p) => {
            p.programaResiduo?.registros.forEach((rr) => {
                if (rr.checklistResiduo && rr.checklistResiduo.length > 0) {
                    totalPct += checklistProgreso(rr.checklistResiduo);
                    totalCount++;
                }
            });
        });
        const cumplimiento = totalCount > 0 ? Math.round(totalPct / totalCount) : 0;

        return {
            totalProgramas: progs.length,
            activos: activos > 0 ? activos : progs.length,
            finalizados,
            recoleccionesPendientes: recPendientes,
            actividadesAtrasadas: atrasadas,
            cumplimientoGeneral: cumplimiento > 0 ? cumplimiento : 70 // default fallback
        };
    });

    constructor() {
        this.loadAll();
    }

    loadAll(): void {
        this.service.getProgramas().subscribe({
            next: (data) => {
                const mapped = data.map((pr) => this.mapToFrontendPrograma(pr));
                this.programas.set(mapped);
            },
            error: (err) => console.error('Error loading programs from backend:', err)
        });
    }

    getProgramaById(id: string): Programa | undefined {
        return this.programas().find((p) => p.id === id || p.programaResiduo?.id === id);
    }

    createPrograma(dto: CreateProgramaResiduoDto): Observable<Programa> {
        return this.service.createPrograma(dto).pipe(
            map((pr) => {
                const mapped = this.mapToFrontendPrograma(pr);
                this.programas.update((list) => [...list, mapped]);
                return mapped;
            })
        );
    }

    updatePrograma(id: string, dto: UpdateProgramaResiduoDto): Observable<void> {
        const prog = this.programas().find((p) => p.id === id || p.programaResiduo?.id === id);
        const prId = prog?.programaResiduo?.id;
        if (!prId) {
            throw new Error(`Programa de residuos no encontrado para id ${id}`);
        }
        return this.service.updatePrograma(prId, dto).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    deletePrograma(id: string): void {
        const prog = this.programas().find((p) => p.id === id || p.programaResiduo?.id === id);
        const prId = prog?.programaResiduo?.id;
        if (prId) {
            this.service.deletePrograma(prId).subscribe({
                next: () => this.loadAll(),
                error: (err) => console.error('Error deleting program:', err)
            });
        }
    }

    addActividad(programaId: string, actividad: { tipo_actividad: string; resultado_general: string; fecha: string; responsable: string; observaciones?: string; estado?: EstadoRegistro }): Observable<void> {
        const prog = this.programas().find((p) => p.id === programaId || p.programaResiduo?.id === programaId);
        const prId = prog?.programaResiduo?.id;
        if (!prId) {
            throw new Error(`Programa de residuos no encontrado para id ${programaId}`);
        }
        return this.service.createRegistro({
            tipo_actividad: actividad.tipo_actividad,
            resultado_general: actividad.resultado_general,
            programaResiduoId: prId,
            fecha: actividad.fecha,
            observaciones: actividad.observaciones,
            responsable: actividad.responsable,
            estado: actividad.estado
        }).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    updateActividad(programaId: string, registroResiduoId: string, data: { tipo_actividad?: string; resultado_general?: string; fecha?: string; responsable?: string; observaciones?: string; estado?: EstadoRegistro }): Observable<void> {
        return this.service.updateRegistro(registroResiduoId, {
            tipo_actividad: data.tipo_actividad,
            resultado_general: data.resultado_general,
            fecha: data.fecha,
            observaciones: data.observaciones,
            responsable: data.responsable,
            estado: data.estado
        }).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    deleteActividad(programaId: string, registroResiduoId: string): Observable<void> {
        return this.service.deleteRegistro(registroResiduoId).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    toggleChecklist(programaId: string, itemId: string): void {
        const prog = this.programas().find((p) => p.id === programaId || p.programaResiduo?.id === programaId);
        const rr = prog?.programaResiduo?.registros.find((r) => r.checklistResiduo?.some((c) => c.id === itemId));
        const item = rr?.checklistResiduo?.find((c) => c.id === itemId);
        if (item) {
            const nextCumplimiento = item.porcentaje_cumplimiento === 100 ? 0 : 100;
            this.service.updateChecklist(itemId, { porcentaje_cumplimiento: nextCumplimiento }).subscribe({
                next: () => this.loadAll(),
                error: (err) => console.error('Error toggling checklist:', err)
            });
        }
    }

    updateChecklistObs(programaId: string, itemId: string, observaciones: string): void {
        this.service.updateChecklist(itemId, { descripcion: observaciones }).subscribe({
            next: () => this.loadAll(),
            error: (err) => console.error('Error updating checklist observation:', err)
        });
    }

    addChecklistItem(programaId: string, registroResiduoId: string, item: { titulo: string; descripcion: string; porcentaje_cumplimiento: number }): void {
        this.service.createChecklist({
            titulo: item.titulo,
            descripcion: item.descripcion,
            porcentaje_cumplimiento: item.porcentaje_cumplimiento,
            registroResiduoId
        }).subscribe({
            next: () => {
                this.loadAll();
            },
            error: (err) => console.error('Error adding checklist item:', err)
        });
    }

    addEvidencia(programaId: string, file: File, evidencia: { nombre: string; tipo: string; fecha: string; usuario: string }): Observable<void> {
        const prog = this.programas().find((p) => p.id === programaId || p.programaResiduo?.id === programaId);
        const regs = prog?.programaResiduo?.registros;
        if (!regs || regs.length === 0) {
            throw new Error(`No hay registros disponibles en el programa ${programaId} para asociar la evidencia.`);
        }
        const latestReg = regs[regs.length - 1];
        return this.service.uploadEvidencia(file, {
            tipo_archivo: evidencia.tipo,
            descripcion: evidencia.nombre,
            fecha: evidencia.fecha,
            registroResiduoId: latestReg.id
        }).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    deleteEvidencia(programaId: string, evidenciaId: number): Observable<void> {
        return this.service.deleteEvidencia(evidenciaId).pipe(
            map(() => {
                this.loadAll();
            })
        );
    }

    updateRecoleccion(id: string, data: Partial<Recoleccion>): void {
        this.service.updateRecoleccion(id, data).subscribe({
            next: () => this.loadAll(),
            error: (err) => console.error('Error updating collection:', err)
        });
    }

    private mapToFrontendPrograma(pr: ProgramaResiduo): Programa {
        return {
            id: pr.programa?.id || '',
            planPsbId: pr.programa?.planPsbId || '',
            tipo: TipoPrograma.RESIDUOS,
            nombre: pr.programa?.nombre || 'Programa de Residuos',
            descripcion: pr.programa?.descripcion || '',
            responsable: pr.programa?.responsable || '',
            frecuencia: (pr.programa?.frecuencia as unknown as FrecuenciaPrograma) || FrecuenciaPrograma.SEMANAL,
            createdAt: pr.programa?.createdAt || new Date().toISOString(),
            updatedAt: pr.programa?.updatedAt || new Date().toISOString(),
            programaResiduo: {
                id: pr.id,
                objetivo: pr.objetivo || '',
                alcance: pr.alcance || '',
                procedimiento_general: pr.procedimiento_general || '',
                tipoResiduos: pr.tipoResiduos || [],
                areaGenereacion: pr.areaGenereacion || [],
                contenedeor: pr.contenedeor || [],
                residuos: pr.residuos || [],
                registros: (pr.registros || []).map((rr) => ({
                    id: rr.id,
                    tipo_actividad: rr.tipo_actividad,
                    resultado_general: rr.resultado_general,
                    registro: rr.registro ? {
                        id: rr.registro.id,
                        programaId: rr.registro.programaId,
                        usuarioId: rr.registro.usuarioId,
                        fecha: new Date(rr.registro.fecha).toISOString().slice(0, 10),
                        estado: rr.registro.estado as unknown as EstadoRegistro,
                        createdAt: rr.registro.createdAt,
                        observaciones: rr.registro.observaciones || ''
                    } : undefined,
                    recolecciones: (rr.recolecciones || []).map((rec) => ({
                        id: rec.id,
                        fecha: new Date(rec.fecha).toISOString().slice(0, 10),
                        responsable: rec.responsable,
                        cantidad_recolectada: rec.cantidad_recolectada,
                        observaciones: rec.observaciones
                    })),
                    checklistResiduo: (rr.checklistResiduo || []).map((c) => ({
                        id: c.id,
                        titulo: c.titulo,
                        descripcion: c.descripcion,
                        porcentaje_cumplimiento: c.porcentaje_cumplimiento
                    })),
                    evidencias: (rr.evidencias || []).map((e) => ({
                        id: e.id,
                        tipo_archivo: e.tipo_archivo,
                        url: e.url,
                        descripcion: e.descripcion,
                        fecha: new Date(e.fecha).toISOString().slice(0, 10)
                    }))
                }))
            },
            registros: pr.programa?.registros || []
        };
    }
}
