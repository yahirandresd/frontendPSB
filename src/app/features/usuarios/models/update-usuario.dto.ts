import { UsuarioEstado, UsuarioRol } from './usuario.interface';

export interface UpdateUsuarioDto {
    nombre?: string;
    rol?: UsuarioRol;
    cargo?: string;
    estado?: UsuarioEstado;
    pinFirmaHash?: string;
    firmaDigitalizada?: string;
}
