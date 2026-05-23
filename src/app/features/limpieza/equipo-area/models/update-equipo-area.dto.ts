import { EstadoEquipoArea, TipoEquipoArea } from './equipo-area.interface';

export interface UpdateEquipoAreaDto {
    nombre?: string;
    tipo?: TipoEquipoArea;
    estado?: EstadoEquipoArea;
}
