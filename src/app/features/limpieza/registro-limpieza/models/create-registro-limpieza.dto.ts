export interface CreateRegistroLimpiezaDto {
    registroId: string;
    programaLimpiezaId: string;
    equipoAreaId?: string;
    superficieLimpiada: string;
    resultadoInspeccion?: string;
}
