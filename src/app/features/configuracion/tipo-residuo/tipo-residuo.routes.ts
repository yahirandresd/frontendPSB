import { Routes } from '@angular/router';

export const TIPO_RESIDUO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/tipo-residuo-list/tipo-residuo-list.component').then(
                (m) => m.TipoResiduoListComponent
            )
    },
    {
        path: 'crear',
        loadComponent: () =>
            import('./pages/tipo-residuo-create/tipo-residuo-create.component').then(
                (m) => m.TipoResiduoCreateComponent
            )
    },
    {
        path: ':id/editar',
        loadComponent: () =>
            import('./pages/tipo-residuo-edit/tipo-residuo-edit.component').then(
                (m) => m.TipoResiduoEditComponent
            )
    }
];
