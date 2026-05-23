import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Documentation } from './app/features/documentation/documentation';
import { Landing } from './app/features/landing/landing';
import { Notfound } from './app/features/notfound/notfound';
import { authGuard } from './app/features/auth/guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/features/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'features', loadChildren: () => import('./app/features/pages.routes') },
            { path: 'configuracion-inicial', loadChildren: () => import('./app/features/configuracion/plan-psb/plan-psb.routes') },
                        // ── Módulo control de plagas ──
            {
                path: 'control-plagas',
                loadChildren: () =>
                    import('./app/features/programa-plagas/control-plagas.routes')
                        .then(m => m.CONTROL_PLAGAS_ROUTES)
            },
            { path: 'limpieza', loadChildren: () => import('./app/features/limpieza/limpieza.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];