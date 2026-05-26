import { Routes } from '@angular/router';
import { RegistroListComponent } from './pages/registro-list/registro-list.component';
import { RegistroCreateComponent } from './pages/registro-create/registro-create.component';
import { RegistroEditComponent } from './pages/registro-edit/registro-edit.component';

export const REGISTRO_ROUTES: Routes = [
    { path: '', component: RegistroListComponent },
    { path: 'crear', component: RegistroCreateComponent },
    { path: ':id/editar', component: RegistroEditComponent },
];
