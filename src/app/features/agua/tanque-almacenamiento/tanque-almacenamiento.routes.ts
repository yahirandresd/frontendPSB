import { Routes } from '@angular/router';
import { TanqueAlmacenamientoListComponent } from './pages/tanque-almacenamiento-list/tanque-almacenamiento-list.component';
import { TanqueAlmacenamientoCreateComponent } from './pages/tanque-almacenamiento-create/tanque-almacenamiento-create.component';
import { TanqueAlmacenamientoEditComponent } from './pages/tanque-almacenamiento-edit/tanque-almacenamiento-edit.component';
import { TanqueAlmacenamientoDetailComponent } from './pages/tanque-almacenamiento-detail/tanque-almacenamiento-detail.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const tanque_almacenamiento_ROUTES: Routes = [
    { path: '', component: TanqueAlmacenamientoListComponent },
    { path: 'crear', component: TanqueAlmacenamientoCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id', component: TanqueAlmacenamientoDetailComponent },
    { path: ':id/editar', component: TanqueAlmacenamientoEditComponent, canDeactivate: [unsavedChangesGuard] },
];