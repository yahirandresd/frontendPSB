import { MetodoValidacion } from './verificacion-limpieza.interface';

export interface UpdateVerificacionLimpiezaDto {
    resultado?: string;
    unidad?: string;
    limiteAceptable?: string;
    metodoValidacion?: MetodoValidacion;
    loteReactivo?: string;
    fechaVencimientoReactivo?: string;
}
