import { Routes } from '@angular/router';
import { RegistroLimpiezaListComponent } from './pages/registro-limpieza-list/registro-limpieza-list.component';
import { RegistroLimpiezaCreateComponent } from './pages/registro-limpieza-create/registro-limpieza-create.component';
import { RegistroLimpiezaEditComponent } from './pages/registro-limpieza-edit/registro-limpieza-edit.component';
import { RegistroLimpiezaDetailComponent } from './pages/registro-limpieza-detail/registro-limpieza-detail.component';

export default [
    { path: '',           component: RegistroLimpiezaListComponent   },
    { path: 'crear',      component: RegistroLimpiezaCreateComponent },
    { path: ':id',        component: RegistroLimpiezaDetailComponent },
    { path: ':id/editar', component: RegistroLimpiezaEditComponent   },
    { path: ':registroId/checklist',      loadChildren: () => import('../checklist-limpieza/checklist-limpieza.routes')         },
    { path: ':registroId/verificaciones', loadChildren: () => import('../verificacion-limpieza/verificacion-limpieza.routes') }
] as Routes;
