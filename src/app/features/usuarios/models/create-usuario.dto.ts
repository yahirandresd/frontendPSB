import { UsuarioEstado, UsuarioRol } from './usuario.interface';

export interface CreateUsuarioDto {
    empresa_id: string;
    nombre: string;
    email: string;
    password: string;
    rol: UsuarioRol;
    cargo?: string;
    estado?: UsuarioEstado;
    firma_digitalizada?: string;
}
