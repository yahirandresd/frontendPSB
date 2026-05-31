import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { authGuard } from './app/features/auth/guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./app/features/dashboard/dashboard').then(m => m.Dashboard)
            },
            { path: 'uikit', loadChildren: () => import('./app/features/uikit/uikit.routes') },
            {
                path: 'documentation',
                loadComponent: () =>
                    import('./app/features/documentation/documentation').then(m => m.Documentation)
            },
            { path: 'features', loadChildren: () => import('./app/features/pages.routes') },
            // ── Registro principal hub (todos los programas) ──
            {
                path: 'registro',
                loadChildren: () =>
                    import('./app/features/registro/registro.routes').then(m => m.REGISTRO_ROUTES)
            },
            // ── Configuración inicial (empresa) ──
            {
                path: 'configuracion-inicial',
                loadChildren: () =>
                    import('./app/features/configuracion/empresa/empresa.routes').then(m => m.EMPRESA_ROUTES)
            },
            // ── Módulo control de plagas ──
            {
                path: 'control-plagas',
                loadChildren: () =>
                    import('./app/features/programa-plagas/control-plagas.routes')
                        .then(m => m.CONTROL_PLAGAS_ROUTES)
            },
            { path: 'limpieza', loadChildren: () => import('./app/features/limpieza/limpieza.routes') },
            // ── Módulo programa agua ──
            {
                path: 'programa-agua',
                loadChildren: () =>
                    import('./app/features/agua/agua.routes').then(m => m.AGUA_ROUTES)
            },
            // ── Módulo programa residuos ──
            {
                path: 'programa-residuos',
                loadChildren: () =>
                    import('./app/features/programa-residuos/programa-residuos.routes')
            },
            // ── Planes de Saneamiento (PSB) ──
            {
                path: 'planes',
                loadChildren: () =>
                    import('./app/features/configuracion/plan-psb/plan-psb.routes')
            },
            // ── Usuarios ──
            { path: 'usuarios', loadChildren: () => import('./app/features/usuarios/usuarios.routes') },
            // ── Catálogos globales ──
            {
                path: 'catalogos/tipos-residuo',
                loadChildren: () =>
                    import('./app/features/configuracion/tipo-residuo/tipo-residuo.routes').then(
                        (m) => m.TIPO_RESIDUO_ROUTES
                    )
            },
        ]
    },
    {
        path: 'landing',
        loadComponent: () =>
            import('./app/features/landing/landing').then(m => m.Landing)
    },
    {
        path: 'notfound',
        loadComponent: () =>
            import('./app/features/notfound/notfound').then(m => m.Notfound)
    },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
