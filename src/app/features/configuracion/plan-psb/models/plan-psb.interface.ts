import { Programa } from '@/app/features/programa/models/programa.interface';

export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';
export type EstadoPlan = 'ACTIVO' | 'BORRADOR' | 'VENCIDO' | 'EN_REVISION';

export interface TipoAlimentoPsb {
    id: number;
    nombre: string;
    descripcion: string;
    nivel_riesgo: NivelRiesgo;
}

export interface PlanPsb {
    id: string;
    version: string;
    estado: EstadoPlan;
    nivel_riesgo: NivelRiesgo;
    createdAt: string;
    updatedAt: string;
    empresa?: { id: string; nombre: string; nit: string };
    tipoAlimento?: TipoAlimentoPsb;
    programa?: Programa;
}
