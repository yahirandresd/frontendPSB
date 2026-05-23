import { Routes } from '@angular/router';
import { RegistroAguaListComponent } from './pages/registro-agua-list/registro-agua-list.component';
import { RegistroAguaCreateComponent } from './pages/registro-agua-create/registro-agua-create.component';
import { RegistroAguaEditComponent } from './pages/registro-agua-edit/registro-agua-edit.component';
export const registro_agua_ROUTES: Routes = [
    { path: '', component: RegistroAguaListComponent },
    { path: 'crear', component: RegistroAguaCreateComponent },
    { path: ':id/editar', component: RegistroAguaEditComponent },
];