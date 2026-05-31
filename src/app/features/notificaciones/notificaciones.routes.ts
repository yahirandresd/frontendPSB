import { Routes } from '@angular/router';

export const NOTIFICACIONES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/notificaciones-list/notificaciones-list.component').then(
                m => m.NotificacionesListComponent
            )
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/notificaciones-detail/notificaciones-detail.component').then(
                m => m.NotificacionesDetailComponent
            )
    }
];
