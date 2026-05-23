export type PrioridadAccion = 'baja' | 'media' | 'alta' | 'inmediata';

export interface AccionCorrectivaPlagas {
  id: string;
  hallazgoId: string;
  descripcion: string;
  fecha: Date;
  responsable: string;
  estado: 'pendiente' | 'en_ejecucion' | 'cerrada';
  prioridad: PrioridadAccion;
  plaguicidaId?: string;
}