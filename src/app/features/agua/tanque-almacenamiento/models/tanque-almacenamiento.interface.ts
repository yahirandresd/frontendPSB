export interface TanqueAlmacenamiento {
    id: string;
    fuenteAguaId: string;
    capacidadLitros: number;
    materialGradoAlimenticio: string;
    fechaUltimoLavado?: string;
    tieneTapa: boolean;
}
export interface CreateTanqueAlmacenamientoDto {
    fuenteAguaId: string;
    capacidadLitros: number;
    materialGradoAlimenticio: string;
    fechaUltimoLavado?: string;
    tieneTapa?: boolean;
}
export interface UpdateTanqueAlmacenamientoDto {
    capacidadLitros?: number;
    materialGradoAlimenticio?: string;
    fechaUltimoLavado?: string;
    tieneTapa?: boolean;
}
