// ══════════════════════════════════════════════
// control-plagas.routes.ts
// ══════════════════════════════════════════════
import { Routes } from '@angular/router';

export const CONTROL_PLAGAS_ROUTES: Routes = [
  {
    // Dashboard principal del módulo
    path: '',
    loadComponent: () =>
      import('./pages/programa-plagas.pages')
        .then(m => m.ProgramaPlagasPageComponent),
  },
  {
    path: 'diagnostico-plagas',
    loadComponent: () =>
      import('./diagnostico-plagas/components/diagnostico.component')
        .then(m => m.DiagnosticoPlagasComponent),
  },
  {
    path: 'hallazgos',
    loadComponent: () =>
      import('./hallazgos/components/hallazgos.component')
        .then(m => m.HallazgoPlagasComponent),
  },
  {
    path: 'acciones-correctivas',
    loadComponent: () =>
      import('./acciones-correctivas-plagas/components/acciones-correctivas-plagas.component')
        .then(m => m.AccionCorrectivaPlagasComponent),
  },
  {
    path: 'empresa-fumigadora',
    loadComponent: () =>
      import('./empresa-fumigadora/components/empresa-fumigadora.component')
        .then(m => m.EmpresaFumigadoraComponent),
  },
  {
    path: 'cronograma',
    loadComponent: () =>
      import('./cronograma/components/cronograma.component')
        .then(m => m.CronogramaComponent),
  },
  {
    path: 'plaguicidas',
    loadComponent: () =>
      import('./plaguicidas/components/plaguicidas.component')
        .then(m => m.PlaguicidaComponent),
  },
  {
    path: 'trampas',
    loadComponent: () =>
      import('./trampas/components/trampas.component')
        .then(m => m.TrampaComponent),
  },
  {
    path: 'registro-plagas',
    loadComponent: () =>
      import('./registro-plagas/pages/registro-plagas.page')
        .then(m => m.RegistroPlagasPageComponent),
  },
  {
    path: 'area-plagas',
    loadComponent: () =>
      import('./area-plagas/pages/area-plagas.pages')
        .then(m => m.AreaPlagasPageComponent),
  },
  {
    path: 'evidencia-plagas',
    loadComponent: () =>
      import('./evidencia-plagas/components/evidencia-plagas.component')
        .then(m => m.EvidenciaPlagasComponent),
  },
  {
    path: 'tipo-plaga',
    loadComponent: () =>
      import('./tipo-plaga/components/tipo-plaga.component')
        .then(m => m.TipoPlagaComponent),
  },
];