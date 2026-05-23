import { Routes } from '@angular/router';
import { MedicionPasoListComponent } from './pages/medicion-paso-list/medicion-paso-list.component';
import { MedicionPasoCreateComponent } from './pages/medicion-paso-create/medicion-paso-create.component';
import { MedicionPasoEditComponent } from './pages/medicion-paso-edit/medicion-paso-edit.component';

export default [
    { path: '',           component: MedicionPasoListComponent   },
    { path: 'crear',      component: MedicionPasoCreateComponent },
    { path: ':id/editar', component: MedicionPasoEditComponent   }
] as Routes;
