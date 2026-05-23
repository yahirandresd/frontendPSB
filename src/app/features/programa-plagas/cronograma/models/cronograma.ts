export interface ActividadCronograma {
  id: string;
  mes: number;           // 1-12
  descripcion: string;
  plaguicidaId: string;
  ejecutada: boolean;
  fechaEjecucion?: Date;
}

export interface Cronograma {
  id: string;
  programaId: string;
  anioVigencia: number;
  frecuenciaControl: string;
  metodoControl: string;
  responsable: string;
  actividades: ActividadCronograma[];
}