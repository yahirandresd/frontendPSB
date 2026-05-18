export interface Empresa {
    id: string;
    nombre: string;
    nit: string;
    tipo_negocio: string;
    direccion: string;
    representante: string;
    registro_sanitario_funcionamiento?: string;
    resolucion_invima?: string;
}
