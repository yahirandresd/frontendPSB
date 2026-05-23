import { EstadoEquipoArea, TipoEquipoArea } from './equipo-area.interface';

export interface CreateEquipoAreaDto {
    empresaId: string;
    nombre: string;
    tipo: TipoEquipoArea;
    estado?: EstadoEquipoArea;
}
