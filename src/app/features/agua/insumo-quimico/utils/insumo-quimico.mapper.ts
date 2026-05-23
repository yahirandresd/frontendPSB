import { InsumoQuimico, CreateInsumoQuimicoDto, UpdateInsumoQuimicoDto } from '../models/insumo-quimico.interface';
export function toCreateDto(form: Partial<InsumoQuimico>): CreateInsumoQuimicoDto {
    return { mantenimientoId: form.mantenimientoId!, nombre: form.nombre!, registroSanitarioInvima: form.registroSanitarioInvima, lote: form.lote, fechaVencimiento: form.fechaVencimiento, concentracion: form.concentracion };
}
export function toUpdateDto(form: Partial<InsumoQuimico>): UpdateInsumoQuimicoDto {
    return { nombre: form.nombre, registroSanitarioInvima: form.registroSanitarioInvima, lote: form.lote, fechaVencimiento: form.fechaVencimiento, concentracion: form.concentracion };
}
