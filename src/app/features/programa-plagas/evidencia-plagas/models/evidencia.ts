export interface Evidencia {
  id: string;
  accionCorrectivaId: string;
  tipoArchivo: 'imagen' | 'pdf' | 'video';
  urlArchivo: string;
  descripcion: string;
  fechaCarga: Date;
}