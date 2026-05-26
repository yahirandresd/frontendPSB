export interface ProductoQuimico {
    id: string;
    empresaId: string;
    codigo: string;
    nombre: string;
    fabricante: string;
    registroSanitarioInvima: string;
    gradoAlimenticio: boolean;
    phPuro?: number;
    dosificacionSugerida?: string;
    fichaTecnicaUrl?: string;
    createdAt: string;
    updatedAt: string;
}
