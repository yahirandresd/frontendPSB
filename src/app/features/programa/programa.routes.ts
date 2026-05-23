import { Routes } from '@angular/router';
import { ProgramaListComponent } from './pages/programa-list/programa-list.component';
import { ProgramaCreateComponent } from './pages/programa-create/programa-create.component';
import { ProgramaEditComponent } from './pages/programa-edit/programa-edit.component';

export const PROGRAMA_ROUTES: Routes = [
    { path: '', component: ProgramaListComponent },
    { path: 'crear', component: ProgramaCreateComponent },
    { path: ':id/editar', component: ProgramaEditComponent },
];
