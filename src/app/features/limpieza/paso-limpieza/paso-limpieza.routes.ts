import { Routes } from '@angular/router';
import { PasoLimpiezaListComponent } from './pages/paso-limpieza-list/paso-limpieza-list.component';
import { PasoLimpiezaCreateComponent } from './pages/paso-limpieza-create/paso-limpieza-create.component';
import { PasoLimpiezaEditComponent } from './pages/paso-limpieza-edit/paso-limpieza-edit.component';

export default [
    { path: '',           component: PasoLimpiezaListComponent   },
    { path: 'crear',      component: PasoLimpiezaCreateComponent },
    { path: ':id/editar', component: PasoLimpiezaEditComponent   },
    { path: ':pasoId/productos', loadChildren: () => import('../paso-limpieza-pq/paso-limpieza-pq.routes') }
] as Routes;
