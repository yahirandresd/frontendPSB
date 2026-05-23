import { Routes } from '@angular/router';
import { ProgramaLimpiezaListComponent } from './pages/programa-limpieza-list/programa-limpieza-list.component';
import { ProgramaLimpiezaCreateComponent } from './pages/programa-limpieza-create/programa-limpieza-create.component';
import { ProgramaLimpiezaEditComponent } from './pages/programa-limpieza-edit/programa-limpieza-edit.component';

export default [
    { path: '',           component: ProgramaLimpiezaListComponent   },
    { path: 'crear',      component: ProgramaLimpiezaCreateComponent },
    { path: ':id/editar', component: ProgramaLimpiezaEditComponent   }
] as Routes;
