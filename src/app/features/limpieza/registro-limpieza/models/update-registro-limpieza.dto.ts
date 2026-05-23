export interface UpdateRegistroLimpiezaDto {
    fecha?: string;
    realizadoPor?: string;
    observaciones?: string;
    estado?: 'pendiente' | 'en_proceso' | 'completado' | 'con_novedad';
}
