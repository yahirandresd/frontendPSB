import { UsuarioEstado, UsuarioRol } from './usuario.interface';

export interface CreateUsuarioDto {
    empresaId: string;
    nombre: string;
    email: string;
    password: string;
    rol: UsuarioRol;
    cargo?: string;
    estado?: UsuarioEstado;
    pinFirmaHash?: string;
    firmaDigitalizada?: string;
}
