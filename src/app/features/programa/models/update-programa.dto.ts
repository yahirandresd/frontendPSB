import { TipoPrograma, FrecuenciaPrograma } from './programa.interface';

export interface UpdateProgramaDto {
    planPsbId?: string;
    tipo?: TipoPrograma;
    nombre?: string;
    responsable?: string;
    frecuencia?: FrecuenciaPrograma;
    descripcion?: string;
}
