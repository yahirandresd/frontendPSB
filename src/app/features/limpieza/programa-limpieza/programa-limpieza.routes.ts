import { Routes } from '@angular/router';
import { ProgramaLimpiezaListComponent } from './pages/programa-limpieza-list/programa-limpieza-list.component';
import { ProgramaLimpiezaCreateComponent } from './pages/programa-limpieza-create/programa-limpieza-create.component';
import { ProgramaLimpiezaEditComponent } from './pages/programa-limpieza-edit/programa-limpieza-edit.component';
import { ProgramaLimpiezaDetailComponent } from './pages/programa-limpieza-detail/programa-limpieza-detail.component';

export default [
    { path: '',           component: ProgramaLimpiezaListComponent   },
    { path: 'crear',      component: ProgramaLimpiezaCreateComponent },
    { path: ':id',        component: ProgramaLimpiezaDetailComponent },
    { path: ':id/editar', component: ProgramaLimpiezaEditComponent   },
    { path: ':programaId/pasos',      loadChildren: () => import('../paso-limpieza/paso-limpieza.routes')       },
    { path: ':programaId/registros',  loadChildren: () => import('../registro-limpieza/registro-limpieza.routes') }
] as Routes;
