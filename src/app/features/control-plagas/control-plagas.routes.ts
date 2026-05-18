// ══════════════════════════════════════════════
// control-plagas.routes.ts
// ══════════════════════════════════════════════
import { Routes } from '@angular/router';

export const CONTROL_PLAGAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
  },
  {
    path: 'diagnostico',
    loadComponent: () =>
      import('./components/diagnostico/diagnostico.component')
        .then(m => m.DiagnosticoComponent),
  },
  {
    path: 'inspecciones',
    loadComponent: () =>
      import('./components/inspeccion/inspeccion.component')
        .then(m => m.InspeccionComponent),
  },
  {
    path: 'hallazgos',
    loadComponent: () =>
      import('./components/hallazgos/hallazgos.component')
        .then(m => m.HallazgosComponent),
  },
  {
    path: 'acciones-correctivas',
    loadComponent: () =>
      import('./components/acciones-correctivas/acciones-correctivas.component')
        .then(m => m.AccionesCorrectivasComponent),
  },
  {
    path: 'empresa-fumigadora',
    loadComponent: () =>
      import('./components/empresa-fumigadora/empresa-fumigadora.component')
        .then(m => m.EmpresaFumigadoraComponent),
  },
  {
    path: 'cronograma',
    loadComponent: () =>
      import('./components/cronograma/cronograma.component')
        .then(m => m.CronogramaComponent),
  },
  {
    path: 'plaguicidas',
    loadComponent: () =>
      import('./components/plaguicidas/plaguicidas.component')
        .then(m => m.PlaguicidasComponent),
  },
  {
    path: 'trampas',
    loadComponent: () =>
      import('./components/trampas/trampas.component')
        .then(m => m.TrampasComponent),
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./components/reportes/reportes.component')
        .then(m => m.ReportesComponent),
  },
];
