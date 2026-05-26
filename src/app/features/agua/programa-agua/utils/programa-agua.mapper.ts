import { ProgramaAgua } from '../models/programa-agua.interface';
import { CreateProgramaAguaDto } from '../models/create-programa-agua.dto';
import { UpdateProgramaAguaDto } from '../models/update-programa-agua.dto';

export function toCreateProgramaAguaDto(form: Partial<ProgramaAgua>): CreateProgramaAguaDto {
    return {
        programaId: form.programaId!,
        objetivo: form.objetivo!,
        alcance: form.alcance!,
        procedimientoGeneral: form.procedimientoGeneral!,
    };
}

export function toUpdateProgramaAguaDto(form: Partial<ProgramaAgua>): UpdateProgramaAguaDto {
    return {
        objetivo: form.objetivo,
        alcance: form.alcance,
        procedimientoGeneral: form.procedimientoGeneral,
    };
}
