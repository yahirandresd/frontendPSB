export interface RegistroLimpieza {
    id: string;
    programaId: string;
    fecha: string;
    realizadoPor: string;
    observaciones?: string;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'con_novedad';
    createdAt: string;
    updatedAt: string;
}
