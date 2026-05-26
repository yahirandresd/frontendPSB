import { UsuarioEstado, UsuarioRol } from './usuario.interface';

export interface UpdateUsuarioDto {
    nombre?: string;
    rol?: UsuarioRol;
    cargo?: string;
    estado?: UsuarioEstado;
    pin_firma_hash?: string;
    firma_digitalizada?: string;
}
