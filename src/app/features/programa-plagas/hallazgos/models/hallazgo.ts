export type SeveridadHallazgo = 'leve' | 'moderado' | 'grave' | 'critico';
 
export interface Hallazgo {
  id: string;
  registroPlagaId: string;
  tipoPlagaId: string;
  trampaId?: string;
  descripcion: string;
  severidad: SeveridadHallazgo;
  fecha: Date;
  estado: 'abierto' | 'en_gestion' | 'cerrado';
  accionesCorrectivas: string[];  // ← array, no string simple
}
 