export type TipoVerificacion = 'ATP' | 'VISUAL' | 'MICROBIOLOGICO' | 'ALERGENOS' | 'QUIMICO';
export type MetodoValidacion = 'ATP' | 'ALERGENOS' | 'VISUAL' | 'MICROBIOLOGICO';

export interface VerificacionLimpieza {
    id: string;
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
    createdAt: string;
    updatedAt: string;
}
