export enum TipoPrograma {
    LIMPIEZA = 'limpieza',
    PLAGAS = 'plagas',
    AGUA = 'agua',
    RESIDUOS = 'residuos',
}

export enum FrecuenciaPrograma {
    DIARIO = 'diario',
    SEMANAL = 'semanal',
    QUINCENAL = 'quincenal',
    MENSUAL = 'mensual',
    TRIMESTRAL = 'trimestral',
    SEMESTRAL = 'semestral',
    ANUAL = 'anual',
}

export enum EstadoRegistro {
    PENDIENTE = 'pendiente',
    EN_PROCESO = 'en_proceso',
    COMPLETADO = 'completado',
    RECHAZADO = 'rechazado',
}

// ─── 1. Entidad General: Programa ───────────────────────────────────────────
export interface Programa {
    id: string;
    planPsbId: string;
    tipo: TipoPrograma;
    nombre: string;
    responsable: string;
    frecuencia: FrecuenciaPrograma;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    // Relaciones
    programaResiduo?: ProgramaResiduo;
    registros?: Registro[];
}

// ─── 2. Entidad Específica: ProgramaResiduo ────────────────────────────────
export interface ProgramaResiduo {
    id: string;
    objetivo: string;
    alcance: string;
    procedimiento_general: string;
    // Relaciones
    programa?: Programa;
    tipoResiduos: TipoResiduo[];
    areaGenereacion: AreaGenereacion[];
    contenedeor: Contenedeor[];
    residuos: Residuo[];
    registros: RegistroResiduo[];
}

// ─── 3. Entidades Auxiliares de ProgramaResiduo ────────────────────────────
export interface AreaGenereacion {
    id: string;
    nombre: string;
    descripcion: string;
    programaResiduo?: ProgramaResiduo;
    residuos?: Residuo[];
}

export interface Contenedeor {
    id: string;
    color: string;
    capacidad: string;
    ubicacion: string;
    estado: string;
    programaResiduo?: ProgramaResiduo;
    residuos?: Residuo[];
}

export interface TipoResiduo {
    id: string;
    nombre: string;
    color_contenedor: string;
    descripcion: string;
    es_peligroso: boolean;
    programaResiduo?: ProgramaResiduo;
    residuos?: Residuo[];
}

export interface Residuo {
    id: string;
    nombre: string;
    descripcion: string;
    fecha_registro: string;
    estado: string;
    programaResiduo?: ProgramaResiduo;
    contenedeor?: Contenedeor;
    tipoResiduo?: TipoResiduo;
    areaGenereacion?: AreaGenereacion;
}


export interface Registro {
    id: string;
    programaId: string;
    usuarioId: string;
    fecha: string;
    horaInicio?: string;
    horaFin?: string;
    observaciones?: string;
    evidenciaFoto?: string;
    estado: EstadoRegistro;
    createdAt: string;
    programa?: Programa;
    residuos?: RegistroResiduo[];
}

export interface RegistroResiduo {
    id: string;
    tipo_actividad: string; // e.g. 'recoleccion' | 'capacitacion' | 'inspeccion' | 'clasificacion' | 'transporte' | 'disposicion'
    resultado_general: string;
    programaResiduo?: ProgramaResiduo;
    registro?: Registro; // Relación ManyToOne con Registro general
    recolecciones: Recoleccion[];
    checklistResiduo: ChecklistResiduo[];
    evidencias: EvidenciaResiduo[];
}

// ─── 5. Relaciones Específicas de RegistroResiduo ───────────────────────────
export interface Recoleccion {
    id: string;
    fecha: string;
    responsable: string;
    cantidad_recolectada: number;
    observaciones: string;
    registroResiduo?: RegistroResiduo;
    disposicionFinal?: DisposicionFinal;
}

export interface ChecklistResiduo {
    id: string;
    titulo: string;
    descripcion: string;
    porcentaje_cumplimiento: number;
    checklistResiduo?: ChecklistResiduo; // Referencia recursiva o a registro
}

export interface EvidenciaResiduo {
    id: number;
    tipo_archivo: string; // 'imagen' | 'pdf' | 'documento'
    url: string;
    descripcion: string;
    fecha: string;
    registroResiduo?: RegistroResiduo;
}

export interface DisposicionFinal {
    id: number;
    metodo: string;
    empresa_encargada: string;
    fecha_disposicion: string;
    recoleccion?: Recoleccion;
}

// ─── DTOs de comunicación en Frontend ──────────────────────────────────────
export interface CreateProgramaResiduoDto {
    nombre: string;
    descripcion: string;
    responsable: string;
    frecuencia: FrecuenciaPrograma;
    objetivo: string;
    alcance: string;
    procedimiento_general: string;
}

export type UpdateProgramaResiduoDto = Partial<CreateProgramaResiduoDto>;

export interface CreateRecoleccionDto {
    fecha: string;
    responsable: string;
    cantidad_recolectada: number;
    observaciones?: string;
    registroResiduoId: string;
}

export type UpdateRecoleccionDto = Partial<
    Pick<Recoleccion, 'fecha' | 'responsable' | 'cantidad_recolectada' | 'observaciones'>
>;

