import { Routes } from '@angular/router';
 
export const CONTROL_PLAGAS_ROUTES: Routes = [
  {
    path: ':programaId',
    loadComponent: () =>
      import('./pages/programa-plagas.pages')
        .then(m => m.ProgramaPlagasPageComponent),
    children: [
 
      { path: 'diagnostico-plagas',
        loadComponent: () => import('./diagnostico-plagas/pages/diagnostico-plagas.page')
          .then(m => m.DiagnosticoPlagasPageComponent) },
 
      { path: 'area-plagas',
        loadComponent: () => import('./area-plagas/pages/area-plagas.pages')
          .then(m => m.AreaPlagasPageComponent) },
 
      // ⚠️ Ruta estática antes de la dinámica
      { path: 'area-plagas/:areaId/trampas',
        loadComponent: () => import('./trampas/pages/trampa.page')
          .then(m => m.TrampaPageComponent) },
 
      { path: 'trampas',
        loadComponent: () => import('./trampas/pages/trampa.page')
          .then(m => m.TrampaPageComponent) },
 
      { path: 'tipo-plaga',
        loadComponent: () => import('./tipo-plaga/pages/tipo-plaga.page')
          .then(m => m.TipoPlagaPageComponent) },
 
      { path: 'plaguicidas',
        loadComponent: () => import('./plaguicidas/pages/plaguicida.page')
          .then(m => m.PlaguicidaPageComponent) },
 
      { path: 'empresa-fumigadora',
        loadComponent: () => import('./empresa-fumigadora/pages/empresa-fumigadora.page')
          .then(m => m.EmpresaFumigadoraPageComponent) },
 
      { path: 'cronograma',
        loadComponent: () => import('./cronograma/pages/cronograma.pages')
          .then(m => m.CronogramaPageComponent) },
 
      { path: 'acciones-correctivas',
        loadComponent: () => import('./acciones-correctivas-plagas/pages/acciones-correctivas-plagas.page')
          .then(m => m.AccionCorrectivaPlagasPageComponent) },
 
      { path: 'registro-plagas',
        loadComponent: () => import('./registro-plagas/pages/registro-plagas.page')
          .then(m => m.RegistroPlagasPageComponent) },
 
      // ⚠️ Rutas estáticas ANTES de las dinámicas
      { path: 'registro-plagas/:registroId/hallazgos',
        loadComponent: () => import('./hallazgos/pages/hallazgo.page')
          .then(m => m.HallazgoPlagasPageComponent) },
 
      { path: 'registro-plagas/:registroId/hallazgos/:hallazgoId/acciones',
        loadComponent: () => import('./acciones-correctivas-plagas/pages/acciones-correctivas-plagas.page')
          .then(m => m.AccionCorrectivaPlagasPageComponent) },
 
      { path: 'registro-plagas/:registroId/evidencias',
        loadComponent: () => import('./evidencia-plagas/pages/evidencia-plagas.page')
          .then(m => m.EvidenciaPlagasPageComponent) },
 
      { path: 'hallazgos',
        loadComponent: () => import('./hallazgos/pages/hallazgo.page')
          .then(m => m.HallazgoPlagasPageComponent) },
 
      { path: 'evidencia-plagas',
        loadComponent: () => import('./evidencia-plagas/pages/evidencia-plagas.page')
          .then(m => m.EvidenciaPlagasPageComponent) },
 
      { path: 'estadisticas',
        loadComponent: () => import('./estadisticas/estadisticas.component')
          .then(m => m.EstadisticasComponent) },
    ],
  },
];