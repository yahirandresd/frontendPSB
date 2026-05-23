import {
    EstadoRegistro,
    FrecuenciaPrograma,
    TipoPrograma
} from '../models/programa-residuos.models';

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const FRECUENCIA_PROGRAMA_LABELS: Record<FrecuenciaPrograma, string> = {
    [FrecuenciaPrograma.DIARIO]: 'Diario',
    [FrecuenciaPrograma.SEMANAL]: 'Semanal',
    [FrecuenciaPrograma.QUINCENAL]: 'Quincenal',
    [FrecuenciaPrograma.MENSUAL]: 'Mensual',
    [FrecuenciaPrograma.TRIMESTRAL]: 'Trimestral',
    [FrecuenciaPrograma.SEMESTRAL]: 'Semestral',
    [FrecuenciaPrograma.ANUAL]: 'Anual'
};

export const ESTADO_REGISTRO_LABELS: Record<EstadoRegistro, string> = {
    [EstadoRegistro.PENDIENTE]: 'Pendiente',
    [EstadoRegistro.EN_PROCESO]: 'En proceso',
    [EstadoRegistro.COMPLETADO]: 'Completado',
    [EstadoRegistro.RECHAZADO]: 'Rechazado'
};

export const ESTADO_REGISTRO_SEVERITY: Record<EstadoRegistro, TagSeverity> = {
    [EstadoRegistro.PENDIENTE]: 'warn',
    [EstadoRegistro.EN_PROCESO]: 'info',
    [EstadoRegistro.COMPLETADO]: 'success',
    [EstadoRegistro.RECHAZADO]: 'danger'
};

export const TIPO_ACTIVIDAD_LABELS: Record<string, string> = {
    recoleccion: 'Recolección',
    capacitacion: 'Capacitación',
    inspeccion: 'Inspección',
    clasificacion: 'Clasificación',
    transporte: 'Transporte',
    disposicion: 'Disposición final'
};

export function checklistProgreso(items: { porcentaje_cumplimiento: number }[]): number {
    if (!items.length) return 0;
    return Math.round(items.reduce((acc, i) => acc + i.porcentaje_cumplimiento, 0) / items.length);
}

export function progresoColor(porcentaje: number): string {
    if (porcentaje >= 80) return '#10b981';
    if (porcentaje >= 50) return '#f59e0b';
    return '#ef4444';
}

