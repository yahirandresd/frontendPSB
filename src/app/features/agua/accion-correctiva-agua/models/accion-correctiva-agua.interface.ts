export type EstadoAccionCorrectiva = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface AccionCorrectivaAgua {
    id: string;
    registroAguaId: string;
    descripcionDesviacion: string;
    medidaTomada: string;
    resultadoVerificacion?: string;
    fecha: string;
    responsable: string;
    estado: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
}
export interface CreateAccionCorrectivaAguaDto {
    registroAguaId: string;
    descripcionDesviacion: string;
    medidaTomada: string;
    resultadoVerificacion?: string;
    fecha: string;
    responsable: string;
    estado?: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
}
export interface UpdateAccionCorrectivaAguaDto {
    descripcionDesviacion?: string;
    medidaTomada?: string;
    resultadoVerificacion?: string;
    fecha?: string;
    responsable?: string;
    estado?: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
}
