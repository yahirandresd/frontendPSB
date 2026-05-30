import { TipoVerificacion, MetodoValidacion } from './verificacion-limpieza.interface';

export interface CreateVerificacionLimpiezaDto {
    registroLimpiezaId: string;
    responsableId: string;
    tipo: TipoVerificacion;
    resultado: string;
    fechaPrueba: string;
    unidad?: string;
    limiteAceptable?: string;
    metodoValidacion?: MetodoValidacion;
    loteReactivo?: string;
    fechaVencimientoReactivo?: string;
}
