export type EstadoRegistro = 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

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
}
