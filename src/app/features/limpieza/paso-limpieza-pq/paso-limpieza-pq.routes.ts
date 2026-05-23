import { Routes } from '@angular/router';
import { PasoLimpiezaPqListComponent } from './pages/paso-limpieza-pq-list/paso-limpieza-pq-list.component';
import { PasoLimpiezaPqCreateComponent } from './pages/paso-limpieza-pq-create/paso-limpieza-pq-create.component';
import { PasoLimpiezaPqEditComponent } from './pages/paso-limpieza-pq-edit/paso-limpieza-pq-edit.component';

export default [
    { path: '',           component: PasoLimpiezaPqListComponent   },
    { path: 'crear',      component: PasoLimpiezaPqCreateComponent },
    { path: ':id/editar', component: PasoLimpiezaPqEditComponent   }
] as Routes;
