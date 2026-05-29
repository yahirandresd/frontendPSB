import { Routes } from '@angular/router';
import { ProgramaAguaListComponent } from './pages/programa-agua-list/programa-agua-list.component';
import { ProgramaAguaCreateComponent } from './pages/programa-agua-create/programa-agua-create.component';
import { ProgramaAguaEditComponent } from './pages/programa-agua-edit/programa-agua-edit.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';

export const PROGRAMA_AGUA_ROUTES: Routes = [
    { path: '', component: ProgramaAguaListComponent },
    { path: 'crear', component: ProgramaAguaCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id/editar', component: ProgramaAguaEditComponent, canDeactivate: [unsavedChangesGuard] },
];
