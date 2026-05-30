export interface UsuarioResumen {
    id: string;
    nombre: string;
    cargo?: string;
    email: string;
}

export interface RegistroBase {
    id: string;
    programaId: string;
    usuarioId: string;
    fecha: string;
    horaInicio?: string;
    horaFin?: string;
    observaciones?: string;
    evidenciaFoto?: string;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'con_novedad';
    createdAt: string;
    usuario?: UsuarioResumen;
}

export interface EquipoAreaResumen {
    id: string;
    nombre: string;
    tipo: string;
    estado: string;
}

export interface RegistroLimpieza {
    id: string;
    registroId: string;
    programaLimpiezaId: string;
    equipoAreaId?: string;
    superficieLimpiada: string;
    resultadoInspeccion?: string;
    createdAt: string;
    registro: RegistroBase;
    equipoArea?: EquipoAreaResumen;
}
