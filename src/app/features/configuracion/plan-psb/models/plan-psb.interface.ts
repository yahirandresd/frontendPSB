import { Programa } from '@/app/features/programa/models/programa.interface';
import { TipoAlimento } from '@/app/features/configuracion/tipo-alimento/models/tipo-alimento.interface';

export type { TipoAlimento };
export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';
export type EstadoPlan = 'ACTIVO' | 'BORRADOR' | 'VENCIDO' | 'EN_REVISION';

export interface PlanPsb {
    id: string;
    nombre: string;
    descripcion: string;
    version: string;
    estado: string;
    nivel_riesgo: string;
    createdAt: string;
    updatedAt: string;
    empresa?: { id: string; nombre: string; nit: string };
    tipoAlimento?: TipoAlimento;
    programa?: Programa;
}
