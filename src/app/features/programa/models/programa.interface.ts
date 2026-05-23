export type TipoPrograma = 'limpieza' | 'plagas' | 'agua' | 'residuos';

export type FrecuenciaPrograma = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';

export interface Programa {
    id: string;
    planPsbId: string;
    tipo: TipoPrograma;
    nombre: string;
    responsable: string;
    frecuencia: FrecuenciaPrograma;
    descripcion?: string;
    createdAt: string;
    updatedAt: string;
}
