export interface Evidencia {
  id: string;
  registroPlagasId: string;
  tipoArchivo: string;
  urlArchivo: string;
  descripcion: string;
  fecha_carga: Date;  // ← snake_case, así lo espera el backend
}
 