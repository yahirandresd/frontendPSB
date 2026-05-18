export interface Reporte {
  id: string;
  programaId: string;
  fechaGeneracion: Date;
  tipo: 'mensual' | 'trimestral' | 'anual' | 'inspeccion';
  periodo: string;
  observaciones: string;
}