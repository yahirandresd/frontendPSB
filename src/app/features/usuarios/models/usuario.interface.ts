export type UsuarioRol = 'superadmin' | 'admin' | 'supervisor' | 'calidad' | 'operario';
export type UsuarioEstado = 'activo' | 'inactivo';

export interface Usuario {
    id: string;
    empresaId: string;
    nombre: string;
    email: string;
    rol: UsuarioRol;
    cargo?: string;
    estado: UsuarioEstado;
    pinFirmaHash?: string;
    firmaDigitalizada?: string;
    createdAt?: string;
    updatedAt?: string;
}
