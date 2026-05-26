export interface CreateProductoQuimicoDto {
    codigo: string;
    nombre: string;
    fabricante: string;
    tipo: string;
    gradoAlimenticio?: boolean;
    ph?: string;
    concentracionRecomendada?: string;
    tiempoContactoMin?: string;
    fichaTecnicaUrl?: string;
}
