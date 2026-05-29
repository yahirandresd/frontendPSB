import { ControlPotabilidad, CreateControlPotabilidadDto, UpdateControlPotabilidadDto } from '../models/control-potabilidad.interface';
export function toCreateDto(form: Partial<ControlPotabilidad>): CreateControlPotabilidadDto {
    return {
        fuenteAguaId: form.fuenteAguaId!,
        fechaHora: form.fechaHora!,
        cloroResidual: form.cloroResidual!,
        ph: form.ph!,
        turbiedad: form.turbiedad!,
        colorAparente: form.colorAparente!,
        temperatura: form.temperatura,
        puntoCaptacion: form.puntoCaptacion!,
        responsableMuestra: form.responsableMuestra!,
        observaciones: form.observaciones,
        evidenciaFoto: form.evidenciaFoto,
        olor: form.olor,
        sabor: form.sabor,
    };
}
export function toUpdateDto(form: Partial<ControlPotabilidad>): UpdateControlPotabilidadDto {
    return {
        fechaHora: form.fechaHora,
        cloroResidual: form.cloroResidual,
        ph: form.ph,
        turbiedad: form.turbiedad,
        colorAparente: form.colorAparente,
        temperatura: form.temperatura,
        puntoCaptacion: form.puntoCaptacion,
        responsableMuestra: form.responsableMuestra,
        observaciones: form.observaciones,
        evidenciaFoto: form.evidenciaFoto,
        olor: form.olor,
        sabor: form.sabor,
    };
}
