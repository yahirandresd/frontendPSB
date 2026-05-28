export type EstadoMantenimiento = 'programado' | 'en_proceso' | 'completado' | 'cancelado';

export interface MantenimientoLavado {
    id: string;
    fuenteAguaId: string;
    registroAguaId?: string;
    fechaProgramada: string;
    fechaEjecucion?: string;
    metodoLimpieza: string;
    observaciones?: string;
    estado: EstadoMantenimiento;
    evidenciaFoto?: string;
    tipoLimpieza?: string;
    productoUtilizado?: string;
    concentracionProducto?: number;
    tiempoContacto?: number;
    volumenAgua?: number;
    proceso?: string;
    responsable?: string;
    proximaLimpieza?: string;
    cumple?: boolean;
}
export interface CreateMantenimientoLavadoDto {
    fuenteAguaId: string;
    registroAguaId?: string;
    fechaProgramada: string;
    fechaEjecucion?: string;
    metodoLimpieza: string;
    observaciones?: string;
    estado?: EstadoMantenimiento;
    evidenciaFoto?: string;
    tipoLimpieza?: string;
    productoUtilizado?: string;
    concentracionProducto?: number;
    tiempoContacto?: number;
    volumenAgua?: number;
    proceso?: string;
    responsable?: string;
    proximaLimpieza?: string;
    cumple?: boolean;
}
export interface UpdateMantenimientoLavadoDto {
    fechaProgramada?: string;
    fechaEjecucion?: string;
    metodoLimpieza?: string;
    observaciones?: string;
    estado?: EstadoMantenimiento;
    evidenciaFoto?: string;
    tipoLimpieza?: string;
    productoUtilizado?: string;
    concentracionProducto?: number;
    tiempoContacto?: number;
    volumenAgua?: number;
    proceso?: string;
    responsable?: string;
    proximaLimpieza?: string;
    cumple?: boolean;
}
