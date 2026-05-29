export interface FuenteAgua {
    id: string;
    programaAguaId: string;
    nombre: string;
    tipo: string;
    proveedor?: string;
    ubicacion?: string;
    requiereTanque: boolean;
    estado: string;
    municipio?: string;
    departamento?: string;
    concesion?: string;
    tratamiento?: string;
    evidenciaFoto?: string;
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
    municipio?: string;
    departamento?: string;
    concesion?: string;
    tratamiento?: string;
    evidenciaFoto?: string;
}
export interface UpdateFuenteAguaDto {
    nombre?: string;
    tipo?: string;
    proveedor?: string;
    ubicacion?: string;
    requiereTanque?: boolean;
    estado?: string;
    municipio?: string;
    departamento?: string;
    concesion?: string;
    tratamiento?: string;
    evidenciaFoto?: string;
}
