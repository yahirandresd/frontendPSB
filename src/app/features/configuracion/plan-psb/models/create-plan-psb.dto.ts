import { NivelRiesgo, EstadoPlan } from './plan-psb.interface';

export interface CreatePlanPsbDto {
    nombre: string;
    descripcion: string;
    nivel_riesgo: NivelRiesgo;
    version: string;
    estado: EstadoPlan;
    empresaId: string;
    tipoAlimentoId: string;
}
