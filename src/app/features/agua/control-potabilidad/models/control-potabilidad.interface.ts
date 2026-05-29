export interface ControlPotabilidad {
    id: string;
    fuenteAguaId: string;
    fuenteAgua?: { id: string; nombre: string };
    registroAguaId?: string;
    fechaHora: string;
    cloroResidual: number;
    ph: number;
    turbiedad: number;
    colorAparente: number;
    temperatura?: number;
    puntoCaptacion: string;
    responsableMuestra: string;
    observaciones?: string;
    cumpleNorma: boolean;
    requiereAnalisisLaboratorio: boolean;
    parametroFueraRango?: string;
    evidenciaFoto?: string;
    olor?: string;
    sabor?: string;
}
export interface CreateControlPotabilidadDto {
    fuenteAguaId: string;
    registroAguaId?: string;
    fechaHora: string;
    cloroResidual: number;
    ph: number;
    turbiedad: number;
    colorAparente: number;
    temperatura?: number;
    puntoCaptacion: string;
    responsableMuestra: string;
    observaciones?: string;
    evidenciaFoto?: string;
    olor?: string;
    sabor?: string;
}
export interface UpdateControlPotabilidadDto {
    fechaHora?: string;
    cloroResidual?: number;
    ph?: number;
    turbiedad?: number;
    colorAparente?: number;
    temperatura?: number;
    puntoCaptacion?: string;
    responsableMuestra?: string;
    observaciones?: string;
    evidenciaFoto?: string;
    olor?: string;
    sabor?: string;
}
