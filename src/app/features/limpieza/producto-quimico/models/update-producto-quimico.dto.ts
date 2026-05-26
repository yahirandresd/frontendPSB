export interface UpdateProductoQuimicoDto {
    codigo?: string;
    nombre?: string;
    fabricante?: string;
    registroSanitarioInvima?: string;
    gradoAlimenticio?: boolean;
    phPuro?: number;
    dosificacionSugerida?: string;
    fichaTecnicaUrl?: string;
}
