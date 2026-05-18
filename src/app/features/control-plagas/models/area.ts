import { NivelRiesgo } from './nivel-riesgo.enum';
export interface Area {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRiesgo: NivelRiesgo;
}
