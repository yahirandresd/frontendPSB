export type TipoActividadAgua = 'control_potabilidad' | 'analisis_laboratorio' | 'mantenimiento_lavado' | 'accion_correctiva';
export type ResultadoGeneralAgua = 'conforme' | 'no_conforme' | 'en_proceso';

export interface RegistroAgua {
    id: string;
    registroId: string;
    programaAguaId: string;
    tipoActividad: TipoActividadAgua;
    resultadoGeneral: ResultadoGeneralAgua;
    periodo?: string;
    responsable?: string;
    porcentajeCumplimiento?: number;
    reporte?: string;
    fechaCierre?: string;
}
export interface CreateRegistroAguaDto {
    registroId: string;
    programaAguaId: string;
    tipoActividad: TipoActividadAgua;
    resultadoGeneral?: ResultadoGeneralAgua;
    periodo?: string;
    responsable?: string;
    porcentajeCumplimiento?: number;
    reporte?: string;
    fechaCierre?: string;
}
export interface UpdateRegistroAguaDto {
    resultadoGeneral?: ResultadoGeneralAgua;
    periodo?: string;
    responsable?: string;
    porcentajeCumplimiento?: number;
    reporte?: string;
    fechaCierre?: string;
}
