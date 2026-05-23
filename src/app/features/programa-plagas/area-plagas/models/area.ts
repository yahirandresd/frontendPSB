export interface Area {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
}
