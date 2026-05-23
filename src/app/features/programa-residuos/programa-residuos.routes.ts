import { Routes } from '@angular/router';
import { ProgramaResiduosShellComponent } from './shell/programa-residuos-shell.component';

export default [
    {
        path: '',
        component: ProgramaResiduosShellComponent,
        children: [
            { path: '', redirectTo: 'panel', pathMatch: 'full' },
            {
                path: 'panel',
                loadComponent: () =>
                    import('./pages/dashboard/pr-dashboard.component').then((m) => m.PrDashboardComponent)
            },
            {
                path: 'programas',
                loadComponent: () =>
                    import('./pages/programas/programas-list/programas-list.component').then(
                        (m) => m.ProgramasListComponent
                    )
            },
            {
                path: 'programas/crear',
                loadComponent: () =>
                    import('./pages/programas/programa-create/programa-create.component').then(
                        (m) => m.ProgramaCreateComponent
                    )
            },
            {
                path: 'programas/:id/editar',
                loadComponent: () =>
                    import('./pages/programas/programa-edit/programa-edit.component').then(
                        (m) => m.ProgramaEditComponent
                    )
            },
            {
                path: 'programas/:id',
                loadComponent: () =>
                    import('./pages/programas/programa-detalle/programa-detalle.component').then(
                        (m) => m.ProgramaDetalleComponent
                    )
            },
            {
                path: 'recolecciones',
                loadComponent: () =>
                    import('./pages/recolecciones/recolecciones-list/recolecciones-list.component').then(
                        (m) => m.RecoleccionesListComponent
                    )
            }
        ]
    }
] as Routes;
