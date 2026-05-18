import { NivelRiesgo } from './nivel-riesgo.enum';

export interface DiagnosticoInicial {
  id: string;
  programaId: string;
  fecha: Date;
  areasEvaluadas: string[];
  plagasIdentificadas: string[];
  nivelRiesgo: NivelRiesgo;
  observaciones: string;
}
