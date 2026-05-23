import { TanqueAlmacenamiento, CreateTanqueAlmacenamientoDto, UpdateTanqueAlmacenamientoDto } from '../models/tanque-almacenamiento.interface';
export function toCreateDto(form: Partial<TanqueAlmacenamiento>): CreateTanqueAlmacenamientoDto {
    return { fuenteAguaId: form.fuenteAguaId!, capacidadLitros: form.capacidadLitros!, materialGradoAlimenticio: form.materialGradoAlimenticio!, fechaUltimoLavado: form.fechaUltimoLavado, tieneTapa: form.tieneTapa };
}
export function toUpdateDto(form: Partial<TanqueAlmacenamiento>): UpdateTanqueAlmacenamientoDto {
    return { capacidadLitros: form.capacidadLitros, materialGradoAlimenticio: form.materialGradoAlimenticio, fechaUltimoLavado: form.fechaUltimoLavado, tieneTapa: form.tieneTapa };
}
