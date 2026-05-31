import { EstadoChecklist } from './checklist-limpieza.interface';

export interface UpdateChecklistLimpiezaDto {
    productoCorrecto?: boolean;
    concentracionCorrecta?: boolean;
    superficieCubierta?: boolean;
    tiempoCumplido?: boolean;
    estado?: EstadoChecklist;
    observacion?: string;
    productoQuimicoId?: string;
    loteUsado?: string;
    concentracionReal?: number;
    volumenPreparadoLitros?: number;
}
