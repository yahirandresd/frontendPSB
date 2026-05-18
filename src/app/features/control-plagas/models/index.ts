// ──────────────────────────────────────────────
// models/empresa.model.ts
// ──────────────────────────────────────────────
export interface Empresa {
  nit: string;
  razonSocial: string;
  direccion: string;
  tipoActividad: string;
  contacto: string;
}

// ──────────────────────────────────────────────
// models/programa-control-plagas.model.ts
// ──────────────────────────────────────────────
export interface ProgramaControlPlagas {
  id: string;
  codigo: string;
  fechaElaboracion: Date;
  responsable: string;
  version: string;
  empresaId: string;
}

// ──────────────────────────────────────────────
// models/diagnostico-inicial.model.ts
// ──────────────────────────────────────────────
import { NivelRiesgo } from './nivel-riesgo.enum';

export interface DiagnosticoInicial {
  id: string;
  programaId: string;
  fecha: Date;
  areasEvaluadas: string[];
  plagasIdentificadas: string[];
  nivelRiesgo: NivelRiesgo;
  observaciones: string;
}

// ──────────────────────────────────────────────
// models/empresa-fumigadora.model.ts
// ──────────────────────────────────────────────
export interface EmpresaFumigadora {
  id: string;
  nit: string;
  nombreEmpresa: string;
  numCertSanitario: string;
  fechaVencCert: Date;
  registroSDS: string;
  telefonoContacto: string;
}

// ──────────────────────────────────────────────
// models/cronograma.model.ts
// ──────────────────────────────────────────────
export interface ActividadCronograma {
  id: string;
  mes: number;           // 1-12
  descripcion: string;
  plaguicidaId: string;
  ejecutada: boolean;
  fechaEjecucion?: Date;
}

export interface Cronograma {
  id: string;
  programaId: string;
  anioVigencia: number;
  frecuenciaControl: string;
  metodoControl: string;
  responsable: string;
  actividades: ActividadCronograma[];
}

// ──────────────────────────────────────────────
// models/area.model.ts
// ──────────────────────────────────────────────
export interface Area {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRiesgo: NivelRiesgo;
}

// ──────────────────────────────────────────────
// models/trampa.model.ts
// ──────────────────────────────────────────────
export type EstadoTrampa = 'activa' | 'inactiva' | 'mantenimiento';

export interface Trampa {
  id: string;
  codigo: string;
  tipo: string;          // 'cebo' | 'insectocutor' | 'trampa-adhesiva' | 'jaula'
  areaId: string;
  ubicacion: string;
  estado: EstadoTrampa;
  fechaInstalacion: Date;
  ultimaRevision: Date;
}

// ──────────────────────────────────────────────
// models/tipo-plaga.model.ts
// ──────────────────────────────────────────────
export interface TipoPlaga {
  id: string;
  nombre: string;
  categoria: string;     // 'roedor' | 'insecto' | 'ave' | 'quiroptero'
  riesgoSanitario: string;
}

// ──────────────────────────────────────────────
// models/inspeccion.model.ts
// ──────────────────────────────────────────────
export type EstadoInspeccion = 'programada' | 'en_curso' | 'finalizada';

export interface Inspeccion {
  id: string;
  programaId: string;
  areaId: string;
  empresaFumigadoraId: string;
  fecha: Date;
  hora: string;
  observaciones: string;
  resultado: string;
  estado: EstadoInspeccion;
}

// ──────────────────────────────────────────────
// models/hallazgo.model.ts
// ──────────────────────────────────────────────
export type SeveridadHallazgo = 'leve' | 'moderado' | 'grave' | 'critico';

export interface Hallazgo {
  id: string;
  inspeccionId: string;
  trampaId?: string;
  tipoPlaga: TipoPlaga;
  descripcion: string;
  severidad: SeveridadHallazgo;
  fecha: Date;
  estado: 'abierto' | 'en_gestion' | 'cerrado';
}

// ──────────────────────────────────────────────
// models/accion-correctiva.model.ts
// ──────────────────────────────────────────────
export type PrioridadAccion = 'baja' | 'media' | 'alta' | 'inmediata';

export interface AccionCorrectiva {
  id: string;
  hallazgoId: string;
  descripcion: string;
  fecha: Date;
  responsable: string;
  estado: 'pendiente' | 'en_ejecucion' | 'cerrada';
  prioridad: PrioridadAccion;
  plaguicidaId?: string;
}

// ──────────────────────────────────────────────
// models/plaguicida.model.ts
// ──────────────────────────────────────────────
export interface Plaguicida {
  id: string;
  codigoRegistro: string;
  nombreComercial: string;
  ingredienteActivo: string;
  categoriaOMS: string;   // 'Ia' | 'Ib' | 'II' | 'III' | 'U'
  dosisAplicacion: string;
  registroICA: string;
  fichaTecnicaUrl?: string;
}

// ──────────────────────────────────────────────
// models/evidencia.model.ts
// ──────────────────────────────────────────────
export interface Evidencia {
  id: string;
  accionCorrectivaId: string;
  tipoArchivo: 'imagen' | 'pdf' | 'video';
  urlArchivo: string;
  descripcion: string;
  fechaCarga: Date;
}

// ──────────────────────────────────────────────
// models/reporte.model.ts
// ──────────────────────────────────────────────
export interface Reporte {
  id: string;
  programaId: string;
  fechaGeneracion: Date;
  tipo: 'mensual' | 'trimestral' | 'anual' | 'inspeccion';
  periodo: string;
  observaciones: string;
}

// ──────────────────────────────────────────────
// models/notificacion.model.ts
// ──────────────────────────────────────────────
export interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'info' | 'advertencia' | 'urgente';
}
