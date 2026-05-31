import { ConcentracionUnidad } from './create-paso-limpieza-pq.dto';

export interface UpdatePasoLimpiezaPqDto {
    concentracionValor?: number;
    concentracionUnidad?: ConcentracionUnidad;
    tiempoContactoMin?: number;
}
