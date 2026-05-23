import { Routes } from '@angular/router';
import { RegistroLimpiezaListComponent } from './pages/registro-limpieza-list/registro-limpieza-list.component';
import { RegistroLimpiezaCreateComponent } from './pages/registro-limpieza-create/registro-limpieza-create.component';
import { RegistroLimpiezaEditComponent } from './pages/registro-limpieza-edit/registro-limpieza-edit.component';

export default [
    { path: '',           component: RegistroLimpiezaListComponent   },
    { path: 'crear',      component: RegistroLimpiezaCreateComponent },
    { path: ':id/editar', component: RegistroLimpiezaEditComponent   }
] as Routes;
