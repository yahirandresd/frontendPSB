export interface ActividadCronograma {
  id: string;
  mes: number;
  descripcion: string;
  plaguicidaId: string;
  ejecutada: boolean;
  fechaEjecucion?: Date;
}
 
export interface Cronograma {
  id: string;
  programaPlagasId: string; // ← corregido (era programaId)
  anioVigencia: number;
  frecuenciaControl: string;
  metodoControl: string;
  responsable: string;
  actividades?: ActividadCronograma[]; // ← opcional, solo para mostrar en UI
}
 