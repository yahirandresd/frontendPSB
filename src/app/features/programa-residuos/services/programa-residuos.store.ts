import { computed, Injectable, signal } from '@angular/core';
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

function uid(): string {
    return crypto.randomUUID();
}

function defaultChecklist(): ChecklistResiduo[] {
    const items = [
        { titulo: 'Recolección realizada', descripcion: 'Recolección de residuos del área' },
        { titulo: 'Clasificación completada', descripcion: 'Residuos clasificados adecuadamente' },
        { titulo: 'Evidencia cargada', descripcion: 'Registro fotográfico subido' },
        { titulo: 'Transporte autorizado', descripcion: 'Vehículo de transporte autorizado' },
        { titulo: 'Inspección realizada', descripcion: 'Inspección del área completada' }
    ];
    return items.map((item, i) => ({
        id: uid(),
        titulo: item.titulo,
        descripcion: item.descripcion,
        porcentaje_cumplimiento: i < 2 ? 100 : 0
    }));
}

@Injectable({ providedIn: 'root' })
export class ProgramaResiduosStore {
    private readonly programas = signal<Programa[]>(this.seedProgramas());

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
                if (rr.checklistResiduo.length > 0) {
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

    getProgramaById(id: string): Programa | undefined {
        return this.programas().find((p) => p.id === id);
    }

    createPrograma(dto: CreateProgramaResiduoDto): Programa {
        const progId = uid();
        const progResiduoId = uid();
        
        const nuevoPrograma: Programa = {
            id: progId,
            planPsbId: uid(),
            tipo: TipoPrograma.RESIDUOS,
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            responsable: dto.responsable,
            frecuencia: dto.frecuencia,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            registros: []
        };

        const nuevoProgramaResiduo: ProgramaResiduo = {
            id: progResiduoId,
            objetivo: dto.objetivo,
            alcance: dto.alcance,
            procedimiento_general: dto.procedimiento_general,
            programa: nuevoPrograma,
            tipoResiduos: [],
            areaGenereacion: [],
            contenedeor: [],
            residuos: [],
            registros: [
                {
                    id: uid(),
                    tipo_actividad: 'inspeccion',
                    resultado_general: 'Inicialización de programa',
                    checklistResiduo: defaultChecklist(),
                    recolecciones: [],
                    evidencias: []
                }
            ]
        };

        nuevoPrograma.programaResiduo = nuevoProgramaResiduo;
        
        // Link default initial activity in general records list
        const initRegId = uid();
        const initReg: Registro = {
            id: initRegId,
            programaId: progId,
            usuarioId: uid(),
            fecha: new Date().toISOString().slice(0, 10),
            estado: EstadoRegistro.PENDIENTE,
            createdAt: new Date().toISOString(),
            observaciones: 'Registro inicial creado automáticamente'
        };
        nuevoPrograma.registros = [initReg];
        nuevoProgramaResiduo.registros[0].registro = initReg;

        this.programas.update((list) => [...list, nuevoPrograma]);
        return nuevoPrograma;
    }

    updatePrograma(id: string, dto: UpdateProgramaResiduoDto): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== id) return p;
                
                const updatedProg = {
                    ...p,
                    nombre: dto.nombre ?? p.nombre,
                    descripcion: dto.descripcion ?? p.descripcion,
                    responsable: dto.responsable ?? p.responsable,
                    frecuencia: dto.frecuencia ?? p.frecuencia,
                    updatedAt: new Date().toISOString()
                };

                if (updatedProg.programaResiduo) {
                    updatedProg.programaResiduo = {
                        ...updatedProg.programaResiduo,
                        objetivo: dto.objetivo ?? updatedProg.programaResiduo.objetivo,
                        alcance: dto.alcance ?? updatedProg.programaResiduo.alcance,
                        procedimiento_general: dto.procedimiento_general ?? updatedProg.programaResiduo.procedimiento_general
                    };
                }

                return updatedProg;
            })
        );
    }

    deletePrograma(id: string): void {
        this.programas.update((list) => list.filter((p) => p.id !== id));
    }

    addActividad(programaId: string, actividad: { tipo_actividad: string; resultado_general: string; fecha: string; responsable: string; observaciones?: string }): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId) return p;

                const regId = uid();
                const regResiduoId = uid();

                const nuevoReg: Registro = {
                    id: regId,
                    programaId,
                    usuarioId: uid(),
                    fecha: actividad.fecha,
                    estado: EstadoRegistro.PENDIENTE,
                    createdAt: new Date().toISOString(),
                    observaciones: actividad.observaciones
                };

                const nuevoRegResiduo: RegistroResiduo = {
                    id: regResiduoId,
                    tipo_actividad: actividad.tipo_actividad,
                    resultado_general: actividad.resultado_general,
                    registro: nuevoReg,
                    recolecciones: actividad.tipo_actividad === 'recoleccion' ? [
                        {
                            id: uid(),
                            fecha: actividad.fecha,
                            responsable: actividad.responsable,
                            cantidad_recolectada: 150,
                            observaciones: actividad.observaciones || 'Generado automáticamente'
                        }
                    ] : [],
                    checklistResiduo: defaultChecklist(),
                    evidencias: []
                };

                const updatedRegistros = [...(p.registros || []), nuevoReg];
                const updatedProgResiduo = p.programaResiduo ? {
                    ...p.programaResiduo,
                    registros: [...p.programaResiduo.registros, nuevoRegResiduo]
                } : undefined;

                return {
                    ...p,
                    registros: updatedRegistros,
                    programaResiduo: updatedProgResiduo
                };
            })
        );
    }

    updateActividad(programaId: string, registroResiduoId: string, data: { tipo_actividad?: string; resultado_general?: string; fecha?: string; responsable?: string; observaciones?: string; estado?: EstadoRegistro }): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                const updatedRr = p.programaResiduo.registros.map((rr) => {
                    if (rr.id !== registroResiduoId) return rr;

                    const updatedReg = rr.registro ? {
                        ...rr.registro,
                        fecha: data.fecha ?? rr.registro.fecha,
                        estado: data.estado ?? rr.registro.estado,
                        observaciones: data.observaciones ?? rr.registro.observaciones
                    } : undefined;

                    return {
                        ...rr,
                        tipo_actividad: data.tipo_actividad ?? rr.tipo_actividad,
                        resultado_general: data.resultado_general ?? rr.resultado_general,
                        registro: updatedReg,
                        recolecciones: rr.recolecciones.map((rec) => ({
                            ...rec,
                            fecha: data.fecha ?? rec.fecha,
                            responsable: data.responsable ?? rec.responsable
                        }))
                    };
                });

                // Also update the general registros array
                const updatedR = p.registros?.map((r) => {
                    const matchedRr = updatedRr.find((rr) => rr.registro?.id === r.id);
                    if (matchedRr && matchedRr.registro) {
                        return matchedRr.registro;
                    }
                    return r;
                });

                return {
                    ...p,
                    registros: updatedR,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRr
                    }
                };
            })
        );
    }

    deleteActividad(programaId: string, registroResiduoId: string): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                const matchedRr = p.programaResiduo.registros.find((rr) => rr.id === registroResiduoId);
                const regId = matchedRr?.registro?.id;

                return {
                    ...p,
                    registros: p.registros?.filter((r) => r.id !== regId),
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: p.programaResiduo.registros.filter((rr) => rr.id !== registroResiduoId)
                    }
                };
            })
        );
    }

    toggleChecklist(programaId: string, itemId: string): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                const updatedRegistrosResiduo = p.programaResiduo.registros.map((rr) => {
                    const hasItem = rr.checklistResiduo.some((c) => c.id === itemId);
                    if (!hasItem) return rr;

                    return {
                        ...rr,
                        checklistResiduo: rr.checklistResiduo.map((c) =>
                            c.id === itemId
                                ? { ...c, porcentaje_cumplimiento: c.porcentaje_cumplimiento === 100 ? 0 : 100 }
                                : c
                        )
                    };
                });

                return {
                    ...p,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRegistrosResiduo
                    }
                };
            })
        );
    }

    updateChecklistObs(programaId: string, itemId: string, observaciones: string): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                const updatedRegistrosResiduo = p.programaResiduo.registros.map((rr) => {
                    const hasItem = rr.checklistResiduo.some((c) => c.id === itemId);
                    if (!hasItem) return rr;

                    return {
                        ...rr,
                        checklistResiduo: rr.checklistResiduo.map((c) =>
                            c.id === itemId
                                ? { ...c, descripcion: observaciones } // mapping obs to description
                                : c
                        )
                    };
                });

                return {
                    ...p,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRegistrosResiduo
                    }
                };
            })
        );
    }

    addEvidencia(programaId: string, evidencia: { nombre: string; tipo: string; fecha: string; usuario: string }): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                // Add to the latest registroResiduo
                const regs = p.programaResiduo.registros;
                if (regs.length === 0) return p;

                const latestIdx = regs.length - 1;
                const updatedRegs = [...regs];
                const newEvidencia: EvidenciaResiduo = {
                    id: Math.floor(Math.random() * 100000),
                    tipo_archivo: evidencia.tipo,
                    url: 'assets/demo/files/evidencia_residuo.pdf',
                    descripcion: evidencia.nombre,
                    fecha: evidencia.fecha
                };

                updatedRegs[latestIdx] = {
                    ...updatedRegs[latestIdx],
                    evidencias: [...updatedRegs[latestIdx].evidencias, newEvidencia]
                };

                return {
                    ...p,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRegs
                    }
                };
            })
        );
    }

    deleteEvidencia(programaId: string, evidenciaId: number): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (p.id !== programaId || !p.programaResiduo) return p;

                const updatedRegs = p.programaResiduo.registros.map((rr) => ({
                    ...rr,
                    evidencias: rr.evidencias.filter((e) => e.id !== evidenciaId)
                }));

                return {
                    ...p,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRegs
                    }
                };
            })
        );
    }

    updateRecoleccion(id: string, data: Partial<Recoleccion>): void {
        this.programas.update((list) =>
            list.map((p) => {
                if (!p.programaResiduo) return p;

                const updatedRr = p.programaResiduo.registros.map((rr) => {
                    const hasRec = rr.recolecciones.some((r) => r.id === id);
                    if (!hasRec) return rr;

                    return {
                        ...rr,
                        recolecciones: rr.recolecciones.map((rec) =>
                            rec.id === id ? { ...rec, ...data } : rec
                        )
                    };
                });

                return {
                    ...p,
                    programaResiduo: {
                        ...p.programaResiduo,
                        registros: updatedRr
                    }
                };
            })
        );
    }

    private seedProgramas(): Programa[] {
        const p1Id = 'pr-001';
        const p2Id = 'pr-002';

        const prog1: Programa = {
            id: p1Id,
            planPsbId: 'plan-1',
            tipo: TipoPrograma.RESIDUOS,
            nombre: 'Gestión integral de residuos sólidos',
            descripcion: 'Programa de separación, almacenamiento y disposición de residuos en planta láctea.',
            responsable: 'María González',
            frecuencia: FrecuenciaPrograma.SEMANAL,
            createdAt: '2025-01-15T08:00:00Z',
            updatedAt: '2025-05-20T14:30:00Z'
        };

        const prog1Residuo: ProgramaResiduo = {
            id: 'pr-res-001',
            objetivo: 'Reducir residuos a relleno en 30%. Cumplir normativa ambiental vigente.',
            alcance: 'Toda la planta láctea incluyendo áreas de producción, embalaje y administración.',
            procedimiento_general: 'Clasificación en origen de residuos orgánicos, reciclables y peligrosos; recolección interna diaria; y disposición final certificada.',
            programa: prog1,
            tipoResiduos: [],
            areaGenereacion: [],
            contenedeor: [],
            residuos: [],
            registros: []
        };
        prog1.programaResiduo = prog1Residuo;

        // Add records (Registros) for Program 1
        const reg1Id = 'reg-001';
        const reg1: Registro = {
            id: reg1Id,
            programaId: p1Id,
            usuarioId: 'usr-1',
            fecha: '2025-04-01',
            horaInicio: '09:00',
            horaFin: '11:00',
            observaciones: 'Ruta de recolección interna completada sin novedades.',
            estado: EstadoRegistro.COMPLETADO,
            createdAt: '2025-04-01T11:00:00Z'
        };

        const reg1Residuo: RegistroResiduo = {
            id: 'reg-res-001',
            tipo_actividad: 'recoleccion',
            resultado_general: 'Recolección semanal en área de producción realizada.',
            registro: reg1,
            recolecciones: [
                {
                    id: 'rec-001',
                    fecha: '2025-04-01',
                    responsable: 'Juan Pérez',
                    cantidad_recolectada: 320,
                    observaciones: 'Material de empaque recolectado'
                }
            ],
            checklistResiduo: defaultChecklist(),
            evidencias: [
                {
                    id: 101,
                    tipo_archivo: 'documento',
                    url: 'assets/demo/files/acta_capacitacion.pdf',
                    descripcion: 'Acta capacitación Q1',
                    fecha: '2025-03-20'
                }
            ]
        };
        prog1Residuo.registros.push(reg1Residuo);
        prog1.registros = [reg1];

        const reg2Id = 'reg-002';
        const reg2: Registro = {
            id: reg2Id,
            programaId: p1Id,
            usuarioId: 'usr-2',
            fecha: '2025-05-25',
            estado: EstadoRegistro.PENDIENTE,
            createdAt: '2025-05-18T10:00:00Z',
            observaciones: 'Inspección de contenedores de residuo en patio de maniobras.'
        };

        const reg2Residuo: RegistroResiduo = {
            id: 'reg-res-002',
            tipo_actividad: 'inspeccion',
            resultado_general: 'Pendiente inspección mensual.',
            registro: reg2,
            recolecciones: [
                {
                    id: 'rec-002',
                    fecha: '2025-05-22',
                    responsable: 'Juan Pérez',
                    cantidad_recolectada: 450,
                    observaciones: 'Prioridad alta — bodega casi llena'
                }
            ],
            checklistResiduo: defaultChecklist(),
            evidencias: []
        };
        prog1Residuo.registros.push(reg2Residuo);
        prog1.registros.push(reg2);

        // Program 2
        const prog2: Programa = {
            id: p2Id,
            planPsbId: 'plan-1',
            tipo: TipoPrograma.RESIDUOS,
            nombre: 'Residuos peligrosos — aceites y químicos',
            descripcion: 'Manejo de residuos peligrosos generados en mantenimiento y laboratorio.',
            responsable: 'Andrés Mejía',
            frecuencia: FrecuenciaPrograma.MENSUAL,
            createdAt: '2024-06-01T08:00:00Z',
            updatedAt: '2025-05-18T09:00:00Z'
        };

        const prog2Residuo: ProgramaResiduo = {
            id: 'pr-res-002',
            objetivo: 'Trazabilidad completa y almacenamiento temporal certificado.',
            alcance: 'Área de mantenimiento técnico y laboratorio químico.',
            procedimiento_general: 'Contención en tambores rojos herméticos y disposición final con proveedor autorizado.',
            programa: prog2,
            tipoResiduos: [],
            areaGenereacion: [],
            contenedeor: [],
            residuos: [],
            registros: []
        };
        prog2.programaResiduo = prog2Residuo;

        const reg3Id = 'reg-003';
        const reg3: Registro = {
            id: reg3Id,
            programaId: p2Id,
            usuarioId: 'usr-3',
            fecha: '2025-05-20',
            estado: EstadoRegistro.EN_PROCESO,
            createdAt: '2025-05-20T08:00:00Z',
            observaciones: 'Despacho de solventes usados al gestor certificado.'
        };

        const reg3Residuo: RegistroResiduo = {
            id: 'reg-res-003',
            tipo_actividad: 'transporte',
            resultado_general: 'Transporte de aceites usados en ruta.',
            registro: reg3,
            recolecciones: [
                {
                    id: 'rec-003',
                    fecha: '2025-05-20',
                    responsable: 'Laura Ruiz',
                    cantidad_recolectada: 180,
                    observaciones: 'Aceites minerales de mantenimiento'
                }
            ],
            checklistResiduo: defaultChecklist(),
            evidencias: []
        };
        prog2Residuo.registros.push(reg3Residuo);
        prog2.registros = [reg3];

        return [prog1, prog2];
    }
}

