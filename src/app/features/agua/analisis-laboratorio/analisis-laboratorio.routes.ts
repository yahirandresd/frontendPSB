import { Routes } from '@angular/router';
import { AnalisisLaboratorioListComponent } from './pages/analisis-laboratorio-list/analisis-laboratorio-list.component';
import { AnalisisLaboratorioCreateComponent } from './pages/analisis-laboratorio-create/analisis-laboratorio-create.component';
import { AnalisisLaboratorioEditComponent } from './pages/analisis-laboratorio-edit/analisis-laboratorio-edit.component';
import { AnalisisLaboratorioDetailComponent } from './pages/analisis-laboratorio-detail/analisis-laboratorio-detail.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const analisis_laboratorio_ROUTES: Routes = [
    { path: '', component: AnalisisLaboratorioListComponent },
    { path: 'crear', component: AnalisisLaboratorioCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id', component: AnalisisLaboratorioDetailComponent },
    { path: ':id/editar', component: AnalisisLaboratorioEditComponent, canDeactivate: [unsavedChangesGuard] },
];