import { Routes } from '@angular/router';
import { AnalisisLaboratorioListComponent } from './pages/analisis-laboratorio-list/analisis-laboratorio-list.component';
import { AnalisisLaboratorioCreateComponent } from './pages/analisis-laboratorio-create/analisis-laboratorio-create.component';
import { AnalisisLaboratorioEditComponent } from './pages/analisis-laboratorio-edit/analisis-laboratorio-edit.component';
export const analisis_laboratorio_ROUTES: Routes = [
    { path: '', component: AnalisisLaboratorioListComponent },
    { path: 'crear', component: AnalisisLaboratorioCreateComponent },
    { path: ':id/editar', component: AnalisisLaboratorioEditComponent },
];