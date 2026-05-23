import { Routes } from '@angular/router';
import { FuenteAguaListComponent } from './pages/fuente-agua-list/fuente-agua-list.component';
import { FuenteAguaCreateComponent } from './pages/fuente-agua-create/fuente-agua-create.component';
import { FuenteAguaEditComponent } from './pages/fuente-agua-edit/fuente-agua-edit.component';
export const fuente_agua_ROUTES: Routes = [
    { path: '', component: FuenteAguaListComponent },
    { path: 'crear', component: FuenteAguaCreateComponent },
    { path: ':id/editar', component: FuenteAguaEditComponent },
];