export type TipoPrograma = 'limpieza' | 'plagas' | 'agua' | 'residuos';

export type FrecuenciaPrograma = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';

export interface Programa {
    id: string;
    planPsbId: string;
    tipo: TipoPrograma;
    nombre: string | null;
    responsable: string | null;
    frecuencia: FrecuenciaPrograma | null;
    descripcion?: string | null;
    planPsb?: { id: string; nombre: string };
    createdAt: string;
    updatedAt: string;
}
