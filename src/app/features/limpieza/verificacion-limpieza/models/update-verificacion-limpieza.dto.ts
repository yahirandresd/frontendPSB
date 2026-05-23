export interface UpdateVerificacionLimpiezaDto {
    verificadoPor?: string;
    fecha?: string;
    resultado?: 'aprobado' | 'rechazado' | 'observacion';
    observaciones?: string;
    accionCorrectiva?: string;
}
