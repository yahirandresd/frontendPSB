export interface CreateChecklistLimpiezaDto {
    registroId: string;
    pasoId: string;
    completado?: boolean;
    observaciones?: string;
}
