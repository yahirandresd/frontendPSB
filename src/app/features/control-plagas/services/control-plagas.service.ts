import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProgramaControlPlagas,
  DiagnosticoInicial,
  EmpresaFumigadora,
  Cronograma,
  Inspeccion,
  Hallazgo,
  AccionCorrectiva,
  Plaguicida,
  Reporte,
  Notificacion,
} from '../models';

const BASE = '/api/control-plagas';

@Injectable({ providedIn: 'root' })
export class ControlPlagasService {

  // ── Estado reactivo (signals) ──────────────────
  private _programa = signal<ProgramaControlPlagas | null>(null);
  private _alertas   = signal<Notificacion[]>([]);

  readonly programa  = this._programa.asReadonly();
  readonly alertas   = this._alertas.asReadonly();
  readonly hayAlertas = computed(() => this._alertas().length > 0);

  constructor(private http: HttpClient) {}

  // ── Programa ───────────────────────────────────
  cargarPrograma(empresaId: string): Observable<ProgramaControlPlagas> {
    return this.http.get<ProgramaControlPlagas>(`${BASE}/programa/${empresaId}`);
  }

  crearPrograma(data: Partial<ProgramaControlPlagas>): Observable<ProgramaControlPlagas> {
    return this.http.post<ProgramaControlPlagas>(`${BASE}/programa`, data);
  }

  // ── Diagnóstico inicial ────────────────────────
  obtenerDiagnostico(programaId: string): Observable<DiagnosticoInicial> {
    return this.http.get<DiagnosticoInicial>(`${BASE}/diagnostico/${programaId}`);
  }

  registrarDiagnostico(data: Partial<DiagnosticoInicial>): Observable<DiagnosticoInicial> {
    return this.http.post<DiagnosticoInicial>(`${BASE}/diagnostico`, data);
  }

  // ── Empresa fumigadora ─────────────────────────
  listarEmpresasFumigadoras(): Observable<EmpresaFumigadora[]> {
    return this.http.get<EmpresaFumigadora[]>(`${BASE}/empresas-fumigadoras`);
  }

  certificadoVigente(empresa: EmpresaFumigadora): boolean {
    return new Date(empresa.fechaVencCert) > new Date();
  }

  // ── Cronograma ─────────────────────────────────
  obtenerCronograma(programaId: string): Observable<Cronograma> {
    return this.http.get<Cronograma>(`${BASE}/cronograma/${programaId}`);
  }

  // ── Inspecciones ───────────────────────────────
  listarInspecciones(programaId: string): Observable<Inspeccion[]> {
    return this.http.get<Inspeccion[]>(`${BASE}/inspecciones/${programaId}`);
  }

  registrarInspeccion(data: Partial<Inspeccion>): Observable<Inspeccion> {
    return this.http.post<Inspeccion>(`${BASE}/inspecciones`, data);
  }

  finalizarInspeccion(id: string): Observable<Inspeccion> {
    return this.http.patch<Inspeccion>(`${BASE}/inspecciones/${id}/finalizar`, {});
  }

  // ── Hallazgos ──────────────────────────────────
  listarHallazgos(inspeccionId: string): Observable<Hallazgo[]> {
    return this.http.get<Hallazgo[]>(`${BASE}/hallazgos/${inspeccionId}`);
  }

  registrarHallazgo(data: Partial<Hallazgo>): Observable<Hallazgo> {
    return this.http.post<Hallazgo>(`${BASE}/hallazgos`, data);
  }

  // ── Acciones correctivas ───────────────────────
  listarAcciones(hallazgoId: string): Observable<AccionCorrectiva[]> {
    return this.http.get<AccionCorrectiva[]>(`${BASE}/acciones/${hallazgoId}`);
  }

  crearAccion(data: Partial<AccionCorrectiva>): Observable<AccionCorrectiva> {
    return this.http.post<AccionCorrectiva>(`${BASE}/acciones`, data);
  }

  cerrarAccion(id: string): Observable<AccionCorrectiva> {
    return this.http.patch<AccionCorrectiva>(`${BASE}/acciones/${id}/cerrar`, {});
  }

  // ── Plaguicidas ────────────────────────────────
  listarPlaguicidas(): Observable<Plaguicida[]> {
    return this.http.get<Plaguicida[]>(`${BASE}/plaguicidas`);
  }

  // ── Reportes ───────────────────────────────────
  generarReporte(programaId: string, tipo: Reporte['tipo']): Observable<Reporte> {
    return this.http.post<Reporte>(`${BASE}/reportes`, { programaId, tipo });
  }

  // ── Cumplimiento (lógica del diagrama) ─────────
  calcularCumplimiento(programa: ProgramaControlPlagas, inspecciones: Inspeccion[]): number {
    const finalizadas = inspecciones.filter(i => i.estado === 'finalizada').length;
    return inspecciones.length ? (finalizadas / inspecciones.length) * 100 : 0;
  }
}
