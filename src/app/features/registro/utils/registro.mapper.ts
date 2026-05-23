import { Registro } from '../models/registro.interface';
import { CreateRegistroDto } from '../models/create-registro.dto';
import { UpdateRegistroDto } from '../models/update-registro.dto';

export function toCreateDto(form: Partial<Registro>): CreateRegistroDto {
    return { programaId: form.programaId!, usuarioId: form.usuarioId!, fecha: form.fecha!, horaInicio: form.horaInicio, horaFin: form.horaFin, observaciones: form.observaciones, evidenciaFoto: form.evidenciaFoto, estado: form.estado };
}

export function toUpdateDto(form: Partial<Registro>): UpdateRegistroDto {
    return { programaId: form.programaId, usuarioId: form.usuarioId, fecha: form.fecha, horaInicio: form.horaInicio, horaFin: form.horaFin, observaciones: form.observaciones, evidenciaFoto: form.evidenciaFoto, estado: form.estado };
}
