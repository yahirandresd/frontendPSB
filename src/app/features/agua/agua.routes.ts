import { Routes } from '@angular/router';
import { PROGRAMA_AGUA_ROUTES } from './programa-agua/programa-agua.routes';

export const AGUA_ROUTES: Routes = [
    ...PROGRAMA_AGUA_ROUTES,
    { path: 'fuente-agua', loadChildren: () => import('./fuente-agua/fuente-agua.routes').then(m => m.fuente_agua_ROUTES) },
    { path: 'tanque-almacenamiento', loadChildren: () => import('./tanque-almacenamiento/tanque-almacenamiento.routes').then(m => m.tanque_almacenamiento_ROUTES) },
    { path: 'control-potabilidad', loadChildren: () => import('./control-potabilidad/control-potabilidad.routes').then(m => m.control_potabilidad_ROUTES) },
    { path: 'analisis-laboratorio', loadChildren: () => import('./analisis-laboratorio/analisis-laboratorio.routes').then(m => m.analisis_laboratorio_ROUTES) },
    { path: 'mantenimiento-lavado', loadChildren: () => import('./mantenimiento-lavado/mantenimiento-lavado.routes').then(m => m.mantenimiento_lavado_ROUTES) },
    { path: 'insumo-quimico', loadChildren: () => import('./insumo-quimico/insumo-quimico.routes').then(m => m.insumo_quimico_ROUTES) },
    { path: 'registro-agua', loadChildren: () => import('./registro-agua/registro-agua.routes').then(m => m.registro_agua_ROUTES) },
    { path: 'accion-correctiva-agua', loadChildren: () => import('./accion-correctiva-agua/accion-correctiva-agua.routes').then(m => m.accion_correctiva_agua_ROUTES) },
];
