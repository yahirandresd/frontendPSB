import { Routes } from '@angular/router';
import { InsumoQuimicoListComponent } from './pages/insumo-quimico-list/insumo-quimico-list.component';
import { InsumoQuimicoCreateComponent } from './pages/insumo-quimico-create/insumo-quimico-create.component';
import { InsumoQuimicoEditComponent } from './pages/insumo-quimico-edit/insumo-quimico-edit.component';
import { InsumoQuimicoDetailComponent } from './pages/insumo-quimico-detail/insumo-quimico-detail.component';
import { unsavedChangesGuard } from '@/app/features/shared/guards/unsaved-changes.guard';
export const insumo_quimico_ROUTES: Routes = [
    { path: '', component: InsumoQuimicoListComponent },
    { path: 'crear', component: InsumoQuimicoCreateComponent, canDeactivate: [unsavedChangesGuard] },
    { path: ':id', component: InsumoQuimicoDetailComponent },
    { path: ':id/editar', component: InsumoQuimicoEditComponent, canDeactivate: [unsavedChangesGuard] },
];