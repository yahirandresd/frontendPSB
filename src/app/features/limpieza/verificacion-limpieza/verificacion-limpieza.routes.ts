import { Routes } from '@angular/router';
import { VerificacionLimpiezaListComponent } from './pages/verificacion-limpieza-list/verificacion-limpieza-list.component';
import { VerificacionLimpiezaCreateComponent } from './pages/verificacion-limpieza-create/verificacion-limpieza-create.component';
import { VerificacionLimpiezaEditComponent } from './pages/verificacion-limpieza-edit/verificacion-limpieza-edit.component';

export default [
    { path: '',           component: VerificacionLimpiezaListComponent   },
    { path: 'crear',      component: VerificacionLimpiezaCreateComponent },
    { path: ':id/editar', component: VerificacionLimpiezaEditComponent   }
] as Routes;
