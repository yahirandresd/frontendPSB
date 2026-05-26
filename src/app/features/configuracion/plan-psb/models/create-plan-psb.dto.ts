import { NivelRiesgo, EstadoPlan } from './plan-psb.interface';

export interface CreatePlanPsbDto {
    nombre: string;
    nivel_riesgo: NivelRiesgo;
    version: string;
    estado: EstadoPlan;
    empresaId: string;
}
