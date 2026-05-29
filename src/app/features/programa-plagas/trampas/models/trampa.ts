export interface Trampa {
  id: string;
  areaPlagaId: string;
  codigo: string;
  tipo: string;
  ubicacion: string;
  estado: string;
  fecha_instalacion: Date;
  fecha_revision: Date;
  accionesCorrectivas?: string[];
}
 