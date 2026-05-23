export type EstadoTrampa = 'activa' | 'inactiva' | 'mantenimiento';

export interface Trampa {
  id: string;
  codigo: string;
  tipo: string;          // 'cebo' | 'insectocutor' | 'trampa-adhesiva' | 'jaula'
  areaId: string;
  ubicacion: string;
  estado: EstadoTrampa;
  fechaInstalacion: Date;
  ultimaRevision: Date;
}
