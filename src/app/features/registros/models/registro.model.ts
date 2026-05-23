export type EstadoRegistro = 'Pendiente' | 'Completado';

export interface Registro {
    id: number;
    fecha: string;
    tipoActividad: string;
    responsable: string;
    observaciones: string;
    estado: EstadoRegistro;
}