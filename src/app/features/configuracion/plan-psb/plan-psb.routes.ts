import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./pages/plan-psb-list/plan-psb-list.component').then(m => m.PlanPsbListComponent)
    },
    {
        path: 'crear',
        loadComponent: () =>
            import('./pages/plan-psb-create/plan-psb-create.component').then(m => m.PlanPsbCreateComponent)
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/plan-psb-detail/plan-psb-detail.component').then(m => m.PlanPsbDetailComponent)
    },
    {
        path: ':id/editar',
        loadComponent: () =>
            import('./pages/plan-psb-edit/plan-psb-edit.component').then(m => m.PlanPsbEditComponent)
    }
] as Routes;
