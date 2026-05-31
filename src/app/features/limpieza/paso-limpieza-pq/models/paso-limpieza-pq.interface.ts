import { ConcentracionUnidad } from './create-paso-limpieza-pq.dto';

export interface PasoLimpiezaPq {
    id: string;
    pasoLimpiezaId: string;
    productoQuimicoId: string;
    nombreProducto?: string;
    concentracionValor: number;
    concentracionUnidad: ConcentracionUnidad;
    tiempoContactoMin: number;
    createdAt: string;
    updatedAt: string;
}
