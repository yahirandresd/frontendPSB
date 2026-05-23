import { AccionCorrectivaAgua, CreateAccionCorrectivaAguaDto, UpdateAccionCorrectivaAguaDto } from '../models/accion-correctiva-agua.interface';
export function toCreateDto(form: Partial<AccionCorrectivaAgua>): CreateAccionCorrectivaAguaDto {
    return { registroAguaId: form.registroAguaId!, descripcionDesviacion: form.descripcionDesviacion!, medidaTomada: form.medidaTomada!, fecha: form.fecha!, responsable: form.responsable!, resultadoVerificacion: form.resultadoVerificacion, estado: form.estado, evidenciaFoto: form.evidenciaFoto };
}
export function toUpdateDto(form: Partial<AccionCorrectivaAgua>): UpdateAccionCorrectivaAguaDto {
    return { descripcionDesviacion: form.descripcionDesviacion, medidaTomada: form.medidaTomada, resultadoVerificacion: form.resultadoVerificacion, fecha: form.fecha, responsable: form.responsable, estado: form.estado, evidenciaFoto: form.evidenciaFoto };
}
