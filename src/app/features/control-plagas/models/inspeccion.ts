export type EstadoInspeccion = 'programada' | 'en_curso' | 'finalizada';

export interface Inspeccion {
  id: string;
  programaId: string;
  areaId: string;
  empresaFumigadoraId: string;
  fecha: Date;
  hora: string;
  observaciones: string;
  resultado: string;
  estado: EstadoInspeccion;
}