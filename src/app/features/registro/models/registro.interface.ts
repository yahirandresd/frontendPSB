export type EstadoRegistro = 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

export interface ProgramaRef {
    id: string;
    nombre?: string;
    tipo?: string;
    descripcion?: string;
}

export interface UsuarioRef {
    id: string;
    email: string;
    nombre?: string;
}

export interface RegistroAguaRef {
    id: string;
    registroId: string;
    programaAguaId: string;
    tipoActividad: string;
    resultadoGeneral: string;
}

export interface RegistroLimpiezaRef {
    id: string;
    registroId: string;
}

export interface RegistroPlagasRef {
    id: string;
    registroId: string;
}

export interface RegistroResiduoRef {
    id: string;
    registroId: string;
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
    programa?: ProgramaRef;
    usuario?: UsuarioRef;
    agua?: RegistroAguaRef[];
    residuos?: RegistroResiduoRef[];
    plagas?: RegistroPlagasRef[];
    limpieza?: RegistroLimpiezaRef[];
}
