export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';

export interface TipoAlimento {
    id: number;
    nombre: string;
    descripcion: string;
    nivel_riesgo: NivelRiesgo;
}
