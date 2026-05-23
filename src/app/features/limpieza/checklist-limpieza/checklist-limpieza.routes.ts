import { Routes } from '@angular/router';
import { ChecklistLimpiezaListComponent } from './pages/checklist-limpieza-list/checklist-limpieza-list.component';
import { ChecklistLimpiezaCreateComponent } from './pages/checklist-limpieza-create/checklist-limpieza-create.component';
import { ChecklistLimpiezaEditComponent } from './pages/checklist-limpieza-edit/checklist-limpieza-edit.component';

export default [
    { path: '',           component: ChecklistLimpiezaListComponent   },
    { path: 'crear',      component: ChecklistLimpiezaCreateComponent },
    { path: ':id/editar', component: ChecklistLimpiezaEditComponent   }
] as Routes;
