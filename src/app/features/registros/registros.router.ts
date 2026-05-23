import { Routes } from '@angular/router';

export const REGISTROS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/registros-list.component').then(m => m.RegistrosListComponent)
    }
];