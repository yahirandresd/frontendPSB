import { Programa } from '../models/programa.interface';
import { CreateProgramaDto } from '../models/create-programa.dto';
import { UpdateProgramaDto } from '../models/update-programa.dto';

export function toCreateDto(form: Partial<Programa>): CreateProgramaDto {
    return { planPsbId: form.planPsbId!, tipo: form.tipo!, nombre: form.nombre!, responsable: form.responsable!, frecuencia: form.frecuencia!, descripcion: form.descripcion };
}

export function toUpdateDto(form: Partial<Programa>): UpdateProgramaDto {
    return { planPsbId: form.planPsbId, tipo: form.tipo, nombre: form.nombre, responsable: form.responsable, frecuencia: form.frecuencia, descripcion: form.descripcion };
}
