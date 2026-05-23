import { RegistroAgua, CreateRegistroAguaDto, UpdateRegistroAguaDto } from '../models/registro-agua.interface';
export function toCreateDto(form: Partial<RegistroAgua>): CreateRegistroAguaDto {
    return { registroId: form.registroId!, programaAguaId: form.programaAguaId!, tipoActividad: form.tipoActividad!, resultadoGeneral: form.resultadoGeneral };
}
export function toUpdateDto(form: Partial<RegistroAgua>): UpdateRegistroAguaDto {
    return { resultadoGeneral: form.resultadoGeneral };
}
