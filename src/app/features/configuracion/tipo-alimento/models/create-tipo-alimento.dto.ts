import { NivelRiesgo } from './tipo-alimento.interface';

export interface CreateTipoAlimentoDto {
    empresa_id: string;
    nombre: string;
    nivel_riesgo: NivelRiesgo;
    descripcion?: string;
}
