export interface AnalisisLaboratorio {
    id: string;
    fuenteAguaId: string;
    registroAguaId?: string;
    numeroCertificado: string;
    laboratorioCertificado: string;
    fechaMuestreo: string;
    fechaEntregaResultado?: string;
    responsableMuestra: string;
    puntoMuestreo: string;
    cloroResidual: number;
    ph: number;
    turbiedad: number;
    colorAparente: number;
    coliformesTotalesPresentes: boolean;
    eColiPresente: boolean;
    mesofilos: number;
    cumpleNormaFisicoquimica: boolean;
    cumpleNormaMicrobiologica: boolean;
    cumpleNormaGeneral: boolean;
    irca?: number;
    nivelRiesgo?: string;
    resultado?: string;
    linkDocumentoPdf?: string;
    fotoEvidencia?: string;
}
export interface CreateAnalisisLaboratorioDto {
    fuenteAguaId: string;
    numeroCertificado: string;
    laboratorioCertificado: string;
    fechaMuestreo: string;
    fechaEntregaResultado?: string;
    responsableMuestra: string;
    puntoMuestreo: string;
    cloroResidual: number;
    ph: number;
    turbiedad: number;
    colorAparente: number;
    coliformesTotalesPresentes: boolean;
    eColiPresente: boolean;
    mesofilos?: number;
    linkDocumentoPdf?: string;
    fotoEvidencia?: string;
}
export interface UpdateAnalisisLaboratorioDto {
    numeroCertificado?: string;
    laboratorioCertificado?: string;
    fechaMuestreo?: string;
    fechaEntregaResultado?: string;
    responsableMuestra?: string;
    puntoMuestreo?: string;
    cloroResidual?: number;
    ph?: number;
    turbiedad?: number;
    colorAparente?: number;
    coliformesTotalesPresentes?: boolean;
    eColiPresente?: boolean;
    mesofilos?: number;
    linkDocumentoPdf?: string;
    fotoEvidencia?: string;
}
