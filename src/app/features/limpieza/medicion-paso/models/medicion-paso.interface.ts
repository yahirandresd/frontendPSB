export interface MedicionPaso {
    id: string;
    checklistId: string;
    parametro: string;
    valorObtenido: string;
    valorEsperado?: string;
    unidad?: string;
    cumple: boolean;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
}
