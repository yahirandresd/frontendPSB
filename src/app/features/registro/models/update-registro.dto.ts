import { EstadoRegistro } from './registro.interface';

export interface UpdateRegistroDto {
    programaId?: string;
    usuarioId?: string;
    fecha?: string;
    horaInicio?: string;
    horaFin?: string;
    observaciones?: string;
    evidenciaFoto?: string;
    estado?: EstadoRegistro;
}
