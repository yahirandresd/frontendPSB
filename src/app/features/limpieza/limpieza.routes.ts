import { Routes } from '@angular/router';

export default [
    { path: 'programas', loadChildren: () => import('./programa-limpieza/programa-limpieza.routes') }
] as Routes;
