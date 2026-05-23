export type SeveridadHallazgo = 'leve' | 'moderado' | 'grave' | 'critico';
import { TipoPlaga } from "../../tipo-plaga/models/tipo-plaga";
export interface Hallazgo {
  id: string;
  inspeccionId: string;
  trampaId?: string;
  tipoPlaga: TipoPlaga;
  descripcion: string;
  severidad: SeveridadHallazgo;
  fecha: Date;
  estado: 'abierto' | 'en_gestion' | 'cerrado';
}
