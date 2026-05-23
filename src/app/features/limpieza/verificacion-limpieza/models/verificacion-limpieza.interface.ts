export interface VerificacionLimpieza {
    id: string;
    registroId: string;
    verificadoPor: string;
    fecha: string;
    resultado: 'aprobado' | 'rechazado' | 'observacion';
    observaciones?: string;
    accionCorrectiva?: string;
    createdAt: string;
    updatedAt: string;
}
