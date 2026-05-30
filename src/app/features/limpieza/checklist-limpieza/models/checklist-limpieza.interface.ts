export type EstadoChecklist = 'APROBADO' | 'RECHAZADO' | 'OBSERVACION';

export interface ChecklistLimpieza {
    id: string;
    registroLimpiezaId: string;
    pasoLimpiezaId: string;
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
    createdAt: string;
    updatedAt: string;
}
