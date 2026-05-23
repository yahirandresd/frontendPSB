export interface FuenteAgua {
    id: string;
    programaAguaId: string;
    nombre: string;
    tipo: string;
    proveedor?: string;
    ubicacion?: string;
    requiereTanque: boolean;
    estado: string;
    tanqueAlmacenamiento?: any;
}
export interface CreateFuenteAguaDto {
    programaAguaId: string;
    nombre: string;
    tipo: string;
    proveedor?: string;
    ubicacion?: string;
    requiereTanque?: boolean;
    estado?: string;
}
export interface UpdateFuenteAguaDto {
    nombre?: string;
    tipo?: string;
    proveedor?: string;
    ubicacion?: string;
    requiereTanque?: boolean;
    estado?: string;
}
