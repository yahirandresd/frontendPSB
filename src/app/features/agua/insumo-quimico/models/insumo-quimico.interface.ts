export interface InsumoQuimico {
    id: string;
    mantenimientoId: string;
    nombre: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
}
export interface CreateInsumoQuimicoDto {
    mantenimientoId: string;
    nombre: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
}
export interface UpdateInsumoQuimicoDto {
    nombre?: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
}
