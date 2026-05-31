export type ConcentracionUnidad = 'ppm' | '%' | 'mL/L';

export interface CreatePasoLimpiezaPqDto {
    pasoLimpiezaId: string;
    productoQuimicoId: string;
    concentracionValor: number;
    concentracionUnidad: ConcentracionUnidad;
    tiempoContactoMin: number;
}
