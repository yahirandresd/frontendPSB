import { Routes } from '@angular/router';
import { EquipoAreaListComponent } from './pages/equipo-area-list/equipo-area-list.component';
import { EquipoAreaCreateComponent } from './pages/equipo-area-create/equipo-area-create.component';
import { EquipoAreaEditComponent } from './pages/equipo-area-edit/equipo-area-edit.component';

export default [
    { path: '',           component: EquipoAreaListComponent   },
    { path: 'crear',      component: EquipoAreaCreateComponent },
    { path: ':id/editar', component: EquipoAreaEditComponent   }
] as Routes;
