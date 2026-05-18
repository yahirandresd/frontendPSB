export type TipoPrograma = 'LIMPIEZA' | 'PLAGAS' | 'AGUA' | 'RESIDUOS';

export interface Programa {
    id: string;
    plan_psb_id: string;
    tipo: TipoPrograma;
    nombre: string;
    responsable: string;
    frecuencia: string;
    descripcion?: string;
}
