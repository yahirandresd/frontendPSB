

export interface DiagnosticoInicial {
  id: string;
  programaId: string;
  fecha: Date;
  areasEvaluadas: string[];
  plagasIdentificadas: string[];
  nivelRiesgo: string;
  observaciones: string;
}
