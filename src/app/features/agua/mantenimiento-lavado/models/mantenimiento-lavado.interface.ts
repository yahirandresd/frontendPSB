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
}
export interface UpdateMantenimientoLavadoDto {
    fechaProgramada?: string;
    fechaEjecucion?: string;
    metodoLimpieza?: string;
    observaciones?: string;
    estado?: EstadoMantenimiento;
    evidenciaFoto?: string;
}
