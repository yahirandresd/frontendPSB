import { NivelRiesgo } from './tipo-alimento.interface';

export interface UpdateTipoAlimentoDto {
    nombre?: string;
    nivel_riesgo?: NivelRiesgo;
    descripcion?: string;
}
