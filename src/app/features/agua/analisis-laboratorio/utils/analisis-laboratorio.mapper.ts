import { AnalisisLaboratorio, CreateAnalisisLaboratorioDto, UpdateAnalisisLaboratorioDto } from '../models/analisis-laboratorio.interface';
export function toCreateDto(form: Partial<AnalisisLaboratorio>): CreateAnalisisLaboratorioDto {
    return {
        fuenteAguaId: form.fuenteAguaId!,
        numeroCertificado: form.numeroCertificado!,
        laboratorioCertificado: form.laboratorioCertificado!,
        fechaMuestreo: form.fechaMuestreo!,
        fechaEntregaResultado: form.fechaEntregaResultado,
        responsableMuestra: form.responsableMuestra!,
        puntoMuestreo: form.puntoMuestreo!,
        cloroResidual: form.cloroResidual!,
        ph: form.ph!,
        turbiedad: form.turbiedad!,
        colorAparente: form.colorAparente!,
        coliformesTotalesPresentes: form.coliformesTotalesPresentes!,
        eColiPresente: form.eColiPresente!,
        mesofilos: form.mesofilos,
        linkDocumentoPdf: form.linkDocumentoPdf,
        fotoEvidencia: form.fotoEvidencia,
    };
}
export function toUpdateDto(form: Partial<AnalisisLaboratorio>): UpdateAnalisisLaboratorioDto {
    return {
        numeroCertificado: form.numeroCertificado,
        laboratorioCertificado: form.laboratorioCertificado,
        fechaMuestreo: form.fechaMuestreo,
        fechaEntregaResultado: form.fechaEntregaResultado,
        responsableMuestra: form.responsableMuestra,
        puntoMuestreo: form.puntoMuestreo,
        cloroResidual: form.cloroResidual,
        ph: form.ph,
        turbiedad: form.turbiedad,
        colorAparente: form.colorAparente,
        coliformesTotalesPresentes: form.coliformesTotalesPresentes,
        eColiPresente: form.eColiPresente,
        mesofilos: form.mesofilos,
        linkDocumentoPdf: form.linkDocumentoPdf,
        fotoEvidencia: form.fotoEvidencia,
    };
}
