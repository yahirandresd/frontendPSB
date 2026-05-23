export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';

export interface TipoAlimento {
    id: string;
    empresa_id: string;
    nombre: string;
    nivel_riesgo: NivelRiesgo;
    descripcion?: string;
}
