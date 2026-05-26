import { Routes } from '@angular/router';

export const EMPRESA_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/empresa-config/empresa-config.component').then(m => m.EmpresaConfigComponent)
    },
];
