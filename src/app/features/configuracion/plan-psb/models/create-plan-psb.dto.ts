import { NivelRiesgo } from '../../tipo-alimento/models/tipo-alimento.interface';

export interface CreatePlanPsbDto {
    empresa_id: string;
    tipo_alimento_id: string;
    version: string;
    nivel_riesgo: NivelRiesgo;
    fecha_creacion: string;
}
