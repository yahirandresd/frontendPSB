
export interface DiagnosticoInicial {
  id: string;
  programaPlagasId: string;  // ← corregido (era programaId)
  fecha: Date;
  areasEvaluadas: string;    // ← string, no array
  plagasIdentificadas: string; // ← string, no array
  nivelRiesgo: string;
  observaciones: string;
}