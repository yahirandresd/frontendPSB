import { Routes } from '@angular/router';
import { MantenimientoLavadoListComponent } from './pages/mantenimiento-lavado-list/mantenimiento-lavado-list.component';
import { MantenimientoLavadoCreateComponent } from './pages/mantenimiento-lavado-create/mantenimiento-lavado-create.component';
import { MantenimientoLavadoEditComponent } from './pages/mantenimiento-lavado-edit/mantenimiento-lavado-edit.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const mantenimiento_lavado_ROUTES: Routes = [
    { path: '', component: MantenimientoLavadoListComponent },
    { path: 'crear', component: MantenimientoLavadoCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id/editar', component: MantenimientoLavadoEditComponent, canDeactivate: [unsavedChangesGuard] },
];