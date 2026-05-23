export interface CreateMedicionPasoDto {
    checklistId: string;
    parametro: string;
    valorObtenido: string;
    valorEsperado?: string;
    unidad?: string;
    cumple?: boolean;
    observaciones?: string;
}
