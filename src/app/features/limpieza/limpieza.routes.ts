import { Routes } from '@angular/router';

export default [
    { path: 'programas',          loadChildren: () => import('./programa-limpieza/programa-limpieza.routes') },
    { path: 'equipos',            loadChildren: () => import('./equipo-area/equipo-area.routes')             },
    { path: 'productos-quimicos', loadChildren: () => import('./producto-quimico/producto-quimico.routes')   }
] as Routes;
