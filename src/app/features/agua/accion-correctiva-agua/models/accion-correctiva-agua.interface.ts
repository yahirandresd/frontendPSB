export type EstadoAccionCorrectiva = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface AccionCorrectivaAgua {
    id: string;
    fuenteAguaId: string;
    registroAguaId: string;
    descripcionDesviacion: string;
    medidaTomada: string;
    resultadoVerificacion?: string;
    fecha: string;
    responsable: string;
    estado: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
    parametroIncumplido?: string;
    valorMedido?: number;
    valorEsperado?: number;
    causaRaiz?: string;
    accionInmediata?: string;
    accionCorrectiva?: string;
    fechaLimite?: string;
    verificacionEficacia?: string;
    eficaz?: boolean;
    origen?: string;
}
export interface CreateAccionCorrectivaAguaDto {
    fuenteAguaId: string;
    descripcionDesviacion: string;
    medidaTomada: string;
    resultadoVerificacion?: string;
    fecha: string;
    responsable: string;
    estado?: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
    parametroIncumplido?: string;
    valorMedido?: number;
    valorEsperado?: number;
    causaRaiz?: string;
    accionInmediata?: string;
    accionCorrectiva?: string;
    fechaLimite?: string;
    verificacionEficacia?: string;
    eficaz?: boolean;
    origen?: string;
}
export interface UpdateAccionCorrectivaAguaDto {
    descripcionDesviacion?: string;
    medidaTomada?: string;
    resultadoVerificacion?: string;
    fecha?: string;
    responsable?: string;
    estado?: EstadoAccionCorrectiva;
    evidenciaFoto?: string;
    parametroIncumplido?: string;
    valorMedido?: number;
    valorEsperado?: number;
    causaRaiz?: string;
    accionInmediata?: string;
    accionCorrectiva?: string;
    fechaLimite?: string;
    verificacionEficacia?: string;
    eficaz?: boolean;
    origen?: string;
}
