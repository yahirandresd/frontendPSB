export interface InsumoQuimico {
    id: string;
    mantenimientoId: string;
    nombre: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
    fabricante?: string;
    uso?: string;
    stock?: number;
    unidad?: string;
    fichaTecnica?: string;
    condicionesAlmacenamiento?: string;
}
export interface CreateInsumoQuimicoDto {
    mantenimientoId: string;
    nombre: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
    fabricante?: string;
    uso?: string;
    stock?: number;
    unidad?: string;
    fichaTecnica?: string;
    condicionesAlmacenamiento?: string;
}
export interface UpdateInsumoQuimicoDto {
    nombre?: string;
    registroSanitarioInvima?: string;
    lote?: string;
    fechaVencimiento?: string;
    concentracion?: number;
    fabricante?: string;
    uso?: string;
    stock?: number;
    unidad?: string;
    fichaTecnica?: string;
    condicionesAlmacenamiento?: string;
}
