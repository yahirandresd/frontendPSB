import { Routes } from '@angular/router';
import { UsuarioListComponent } from './pages/usuario-list/usuario-list.component';
import { UsuarioDetailComponent } from './pages/usuario-detail/usuario-detail.component';
import { UsuarioCreateComponent } from './pages/usuario-create/usuario-create.component';
import { UsuarioEditComponent } from './pages/usuario-edit/usuario-edit.component';

export default [
    { path: '',           component: UsuarioListComponent   },
    { path: 'crear',      component: UsuarioCreateComponent },
    { path: ':id',        component: UsuarioDetailComponent },
    { path: ':id/editar', component: UsuarioEditComponent   },
] as Routes;
