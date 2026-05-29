import { Routes } from '@angular/router';
import { ProductoQuimicoListComponent } from './pages/producto-quimico-list/producto-quimico-list.component';
import { ProductoQuimicoCreateComponent } from './pages/producto-quimico-create/producto-quimico-create.component';
import { ProductoQuimicoEditComponent } from './pages/producto-quimico-edit/producto-quimico-edit.component';
import { ProductoQuimicoDetailComponent } from './pages/producto-quimico-detail/producto-quimico-detail.component';

export default [
    { path: '',           component: ProductoQuimicoListComponent   },
    { path: 'crear',      component: ProductoQuimicoCreateComponent },
    { path: ':id',        component: ProductoQuimicoDetailComponent },
    { path: ':id/editar', component: ProductoQuimicoEditComponent   }
] as Routes;
