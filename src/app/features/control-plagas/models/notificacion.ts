export interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'info' | 'advertencia' | 'urgente';
}
