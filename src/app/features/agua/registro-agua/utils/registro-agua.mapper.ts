import { RegistroAgua, CreateRegistroAguaDto, UpdateRegistroAguaDto } from '../models/registro-agua.interface';
export function toCreateDto(form: Partial<RegistroAgua>): CreateRegistroAguaDto {
    return { registroId: form.registroId!, programaAguaId: form.programaAguaId!, tipoActividad: form.tipoActividad!, resultadoGeneral: form.resultadoGeneral, periodo: form.periodo, responsable: form.responsable, porcentajeCumplimiento: form.porcentajeCumplimiento, reporte: form.reporte, fechaCierre: form.fechaCierre };
}
export function toUpdateDto(form: Partial<RegistroAgua>): UpdateRegistroAguaDto {
    return { resultadoGeneral: form.resultadoGeneral, periodo: form.periodo, responsable: form.responsable, porcentajeCumplimiento: form.porcentajeCumplimiento, reporte: form.reporte, fechaCierre: form.fechaCierre };
}
