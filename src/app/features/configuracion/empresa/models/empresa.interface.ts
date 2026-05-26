export interface Empresa {
    id: string;
    nombre: string;
    nit: string;
    tipoNegocio: string;
    direccion: string;
    representante: string;
    registroSanitarioFuncionamiento?: string;
    resolucionInvima?: string;
}
