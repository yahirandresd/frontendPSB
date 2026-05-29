import { Routes } from '@angular/router';
import { AccionCorrectivaAguaListComponent } from './pages/accion-correctiva-agua-list/accion-correctiva-agua-list.component';
import { AccionCorrectivaAguaCreateComponent } from './pages/accion-correctiva-agua-create/accion-correctiva-agua-create.component';
import { AccionCorrectivaAguaEditComponent } from './pages/accion-correctiva-agua-edit/accion-correctiva-agua-edit.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const accion_correctiva_agua_ROUTES: Routes = [
    { path: '', component: AccionCorrectivaAguaListComponent },
    { path: 'crear', component: AccionCorrectivaAguaCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id/editar', component: AccionCorrectivaAguaEditComponent, canDeactivate: [unsavedChangesGuard] },
];