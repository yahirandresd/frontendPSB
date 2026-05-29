import { Routes } from '@angular/router';
import { FuenteAguaListComponent } from './pages/fuente-agua-list/fuente-agua-list.component';
import { FuenteAguaCreateComponent } from './pages/fuente-agua-create/fuente-agua-create.component';
import { FuenteAguaEditComponent } from './pages/fuente-agua-edit/fuente-agua-edit.component';
import { FuenteAguaDetailComponent } from './pages/fuente-agua-detail/fuente-agua-detail.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const fuente_agua_ROUTES: Routes = [
    { path: '', component: FuenteAguaListComponent },
    { path: 'crear', component: FuenteAguaCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id', component: FuenteAguaDetailComponent },
    { path: ':id/editar', component: FuenteAguaEditComponent, canDeactivate: [unsavedChangesGuard] },
];