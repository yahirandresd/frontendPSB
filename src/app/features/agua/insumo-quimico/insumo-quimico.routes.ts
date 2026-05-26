import { Routes } from '@angular/router';
import { InsumoQuimicoListComponent } from './pages/insumo-quimico-list/insumo-quimico-list.component';
import { InsumoQuimicoCreateComponent } from './pages/insumo-quimico-create/insumo-quimico-create.component';
import { InsumoQuimicoEditComponent } from './pages/insumo-quimico-edit/insumo-quimico-edit.component';
export const insumo_quimico_ROUTES: Routes = [
    { path: '', component: InsumoQuimicoListComponent },
    { path: 'crear', component: InsumoQuimicoCreateComponent },
    { path: ':id/editar', component: InsumoQuimicoEditComponent },
];