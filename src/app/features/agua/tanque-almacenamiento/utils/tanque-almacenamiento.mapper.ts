import { TanqueAlmacenamiento, CreateTanqueAlmacenamientoDto, UpdateTanqueAlmacenamientoDto } from '../models/tanque-almacenamiento.interface';
export function toCreateDto(form: Partial<TanqueAlmacenamiento>): CreateTanqueAlmacenamientoDto {
    return { fuenteAguaId: form.fuenteAguaId!, capacidadLitros: form.capacidadLitros!, materialGradoAlimenticio: form.materialGradoAlimenticio!, fechaUltimoLavado: form.fechaUltimoLavado, tieneTapa: form.tieneTapa, tipo: form.tipo, ubicacion: form.ubicacion, tapaBuenEstado: form.tapaBuenEstado, llavePaso: form.llavePaso, proximaLimpieza: form.proximaLimpieza };
}
export function toUpdateDto(form: Partial<TanqueAlmacenamiento>): UpdateTanqueAlmacenamientoDto {
    return { capacidadLitros: form.capacidadLitros, materialGradoAlimenticio: form.materialGradoAlimenticio, fechaUltimoLavado: form.fechaUltimoLavado, tieneTapa: form.tieneTapa, tipo: form.tipo, ubicacion: form.ubicacion, tapaBuenEstado: form.tapaBuenEstado, llavePaso: form.llavePaso, proximaLimpieza: form.proximaLimpieza };
}
