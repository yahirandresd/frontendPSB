export interface CreateProgramaLimpiezaDto {
    programaId: string;
    equipoAreaId?: string;
    objetivo: string;
    alcance: string;
    procedimientoGeneral?: string;
}
