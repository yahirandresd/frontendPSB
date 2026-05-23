export type TipoEquipoArea = 'AREA' | 'EQUIPO' | 'UTENSILIO';
export type EstadoEquipoArea = 'ACTIVO' | 'INACTIVO';

export interface EquipoArea {
    id: string;
    empresaId: string;
    nombre: string;
    tipo: TipoEquipoArea;
    estado: EstadoEquipoArea;
    createdAt: string;
}
