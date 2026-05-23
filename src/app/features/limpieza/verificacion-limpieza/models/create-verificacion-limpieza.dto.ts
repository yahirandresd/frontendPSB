export interface CreateVerificacionLimpiezaDto {
    registroId: string;
    verificadoPor: string;
    fecha: string;
    resultado: 'aprobado' | 'rechazado' | 'observacion';
    observaciones?: string;
    accionCorrectiva?: string;
}
