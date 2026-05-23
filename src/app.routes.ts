import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Documentation } from './app/features/documentation/documentation';
import { Landing } from './app/features/landing/landing';
import { Notfound } from './app/features/notfound/notfound';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/features/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'features', loadChildren: () => import('./app/features/pages.routes') },
            { path: 'configuracion-inicial', loadChildren: () => import('./app/features/configuracion/plan-psb/plan-psb.routes') },
            { path: 'programa-agua', loadChildren: () => import('./app/features/agua/agua.routes').then(m => m.AGUA_ROUTES) },
            { path: 'programas', loadChildren: () => import('./app/features/programa/programa.routes').then(m => m.PROGRAMA_ROUTES) },
            { path: 'registro', loadChildren: () => import('./app/features/registro/registro.routes').then(m => m.REGISTRO_ROUTES) }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];