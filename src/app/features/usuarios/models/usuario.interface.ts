export type UsuarioRol = 'superadmin' | 'admin' | 'supervisor' | 'calidad' | 'operario';
export type UsuarioEstado = 'activo' | 'inactivo';

export interface Usuario {
    id: string;
    empresa_id: string;
    nombre: string;
    email: string;
    rol: UsuarioRol;
    cargo?: string;
    estado: UsuarioEstado;
    pin_firma_hash?: string;
    firma_digitalizada?: string;
    created_at?: string;
    updated_at?: string;
}
