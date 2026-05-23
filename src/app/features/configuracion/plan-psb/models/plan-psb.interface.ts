import { NivelRiesgo } from '../../tipo-alimento/models/tipo-alimento.interface';

export type EstadoPlan = 'BORRADOR' | 'ACTIVO' | 'OBSOLETO';

export interface PlanPSB {
    id: string;
    empresa_id: string;
    tipo_alimento_id: string;
    version: string;
    estado: EstadoPlan;
    nivel_riesgo: NivelRiesgo;
    fecha_creacion: string;
    fecha_actualizacion?: string;
}
