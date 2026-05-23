import { Routes } from '@angular/router';

export default [
    { path: 'programas', loadChildren: () => import('./programa-limpieza/programa-limpieza.routes') },
    { path: 'equipos',   loadChildren: () => import('./equipo-area/equipo-area.routes') }
] as Routes;
