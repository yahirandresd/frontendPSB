import { Routes } from '@angular/router';
import { MantenimientoLavadoListComponent } from './pages/mantenimiento-lavado-list/mantenimiento-lavado-list.component';
import { MantenimientoLavadoCreateComponent } from './pages/mantenimiento-lavado-create/mantenimiento-lavado-create.component';
import { MantenimientoLavadoEditComponent } from './pages/mantenimiento-lavado-edit/mantenimiento-lavado-edit.component';
export const mantenimiento_lavado_ROUTES: Routes = [
    { path: '', component: MantenimientoLavadoListComponent },
    { path: 'crear', component: MantenimientoLavadoCreateComponent },
    { path: ':id/editar', component: MantenimientoLavadoEditComponent },
];