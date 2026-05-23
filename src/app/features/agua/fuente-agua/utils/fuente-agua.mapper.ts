import { FuenteAgua, CreateFuenteAguaDto, UpdateFuenteAguaDto } from '../models/fuente-agua.interface';
export function toCreateDto(form: Partial<FuenteAgua>): CreateFuenteAguaDto {
    return { programaAguaId: form.programaAguaId!, nombre: form.nombre!, tipo: form.tipo!, proveedor: form.proveedor, ubicacion: form.ubicacion, requiereTanque: form.requiereTanque, estado: form.estado };
}
export function toUpdateDto(form: Partial<FuenteAgua>): UpdateFuenteAguaDto {
    return { nombre: form.nombre, tipo: form.tipo, proveedor: form.proveedor, ubicacion: form.ubicacion, requiereTanque: form.requiereTanque, estado: form.estado };
}
