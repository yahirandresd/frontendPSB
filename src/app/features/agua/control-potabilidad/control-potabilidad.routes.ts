import { Routes } from '@angular/router';
import { ControlPotabilidadListComponent } from './pages/control-potabilidad-list/control-potabilidad-list.component';
import { ControlPotabilidadCreateComponent } from './pages/control-potabilidad-create/control-potabilidad-create.component';
import { ControlPotabilidadEditComponent } from './pages/control-potabilidad-edit/control-potabilidad-edit.component';
export const control_potabilidad_ROUTES: Routes = [
    { path: '', component: ControlPotabilidadListComponent },
    { path: 'crear', component: ControlPotabilidadCreateComponent },
    { path: ':id/editar', component: ControlPotabilidadEditComponent },
];