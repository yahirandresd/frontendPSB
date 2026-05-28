import { Routes } from '@angular/router';
import { RegistroAguaListComponent } from './pages/registro-agua-list/registro-agua-list.component';
import { RegistroAguaCreateComponent } from './pages/registro-agua-create/registro-agua-create.component';
import { RegistroAguaEditComponent } from './pages/registro-agua-edit/registro-agua-edit.component';
import { RegistroAguaDetailComponent } from './pages/registro-agua-detail/registro-agua-detail.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const registro_agua_ROUTES: Routes = [
    { path: '', component: RegistroAguaListComponent },
    { path: 'crear', component: RegistroAguaCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id', component: RegistroAguaDetailComponent },
    { path: ':id/editar', component: RegistroAguaEditComponent, canDeactivate: [unsavedChangesGuard] },
];