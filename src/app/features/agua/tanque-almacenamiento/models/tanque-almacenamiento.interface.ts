export interface TanqueAlmacenamiento {
    id: string;
    fuenteAguaId: string;
    capacidadLitros: number;
    materialGradoAlimenticio: string;
    fechaUltimoLavado?: string;
    tieneTapa: boolean;
    tipo?: string;
    ubicacion?: string;
    tapaBuenEstado?: boolean;
    llavePaso?: boolean;
    proximaLimpieza?: string;
}
export interface CreateTanqueAlmacenamientoDto {
    fuenteAguaId: string;
    capacidadLitros: number;
    materialGradoAlimenticio: string;
    fechaUltimoLavado?: string;
    tieneTapa?: boolean;
    tipo?: string;
    ubicacion?: string;
    tapaBuenEstado?: boolean;
    llavePaso?: boolean;
    proximaLimpieza?: string;
}
export interface UpdateTanqueAlmacenamientoDto {
    capacidadLitros?: number;
    materialGradoAlimenticio?: string;
    fechaUltimoLavado?: string;
    tieneTapa?: boolean;
    tipo?: string;
    ubicacion?: string;
    tapaBuenEstado?: boolean;
    llavePaso?: boolean;
    proximaLimpieza?: string;
}
