import { Routes } from '@angular/router';
import { TanqueAlmacenamientoListComponent } from './pages/tanque-almacenamiento-list/tanque-almacenamiento-list.component';
import { TanqueAlmacenamientoCreateComponent } from './pages/tanque-almacenamiento-create/tanque-almacenamiento-create.component';
import { TanqueAlmacenamientoEditComponent } from './pages/tanque-almacenamiento-edit/tanque-almacenamiento-edit.component';
export const tanque_almacenamiento_ROUTES: Routes = [
    { path: '', component: TanqueAlmacenamientoListComponent },
    { path: 'crear', component: TanqueAlmacenamientoCreateComponent },
    { path: ':id/editar', component: TanqueAlmacenamientoEditComponent },
];