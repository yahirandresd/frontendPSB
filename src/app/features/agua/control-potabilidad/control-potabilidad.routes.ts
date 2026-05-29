import { Routes } from '@angular/router';
import { ControlPotabilidadListComponent } from './pages/control-potabilidad-list/control-potabilidad-list.component';
import { ControlPotabilidadCreateComponent } from './pages/control-potabilidad-create/control-potabilidad-create.component';
import { ControlPotabilidadEditComponent } from './pages/control-potabilidad-edit/control-potabilidad-edit.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const control_potabilidad_ROUTES: Routes = [
    { path: '', component: ControlPotabilidadListComponent },
    { path: 'crear', component: ControlPotabilidadCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id/editar', component: ControlPotabilidadEditComponent, canDeactivate: [unsavedChangesGuard] },
];