import { MantenimientoLavado, CreateMantenimientoLavadoDto, UpdateMantenimientoLavadoDto } from '../models/mantenimiento-lavado.interface';
export function toCreateDto(form: Partial<MantenimientoLavado>): CreateMantenimientoLavadoDto {
    return { fuenteAguaId: form.fuenteAguaId!, fechaProgramada: form.fechaProgramada!, metodoLimpieza: form.metodoLimpieza!, fechaEjecucion: form.fechaEjecucion, observaciones: form.observaciones, estado: form.estado, evidenciaFoto: form.evidenciaFoto };
}
export function toUpdateDto(form: Partial<MantenimientoLavado>): UpdateMantenimientoLavadoDto {
    return { fechaProgramada: form.fechaProgramada, fechaEjecucion: form.fechaEjecucion, metodoLimpieza: form.metodoLimpieza, observaciones: form.observaciones, estado: form.estado, evidenciaFoto: form.evidenciaFoto };
}
