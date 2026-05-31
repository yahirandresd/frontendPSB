export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';

export interface TipoAlimento {
    id: string;
    nombre: string;
    descripcion: string;
    nivel_riesgo: NivelRiesgo;
}
