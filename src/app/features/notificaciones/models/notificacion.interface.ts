export interface Notificacion {
    id: string;
    usuarioId: string;
    programaId?: string;
    registroId?: string;
    remitenteId?: string;
    tipo: 'alerta' | 'info' | 'vencimiento';
    titulo: string;
    mensaje: string;
    fechaEnvio: string;
    fechaLimite?: string;
    leida: boolean;
    estado: 'pendiente' | 'atendida';
}
