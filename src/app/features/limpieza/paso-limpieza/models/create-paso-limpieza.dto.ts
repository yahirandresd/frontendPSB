export interface CreatePasoLimpiezaDto {
    programaLimpiezaId: string;
    orden: number;
    descripcion: string;
    tipoAccion: string;
    concentracion?: string;
    tiempoContacto?: string;
    frecuencia: string;
    observaciones?: string;
    temperaturaAguaMinima?: number;
    temperaturaAguaMaxima?: number;
}
