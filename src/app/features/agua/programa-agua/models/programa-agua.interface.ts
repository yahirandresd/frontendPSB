import { Programa } from '../../../programa/models/programa.interface';

export interface ProgramaAgua {
    id: string;
    programaId: string;
    objetivo: string;
    alcance: string;
    procedimientoGeneral: string;
    programa?: Programa;
    fuentesAgua?: any[];
    registrosAgua?: any[];
}
