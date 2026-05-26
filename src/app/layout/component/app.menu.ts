import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [RouterModule],
    template: `
        <ul class="menu-list">
            <li>
                <a routerLink="/dashboard" routerLinkActive="active">
                    <i class="pi pi-home"></i>
                    <span>Inicio</span>
                </a>
            </li>

            <li>
                <a routerLink="/configuracion-inicial" routerLinkActive="active">
                    <i class="pi pi-cog"></i>
                    <span>Configuración Inicial</span>
                </a>
            </li>

            <li>
                <a routerLink="/programa-agua" routerLinkActive="active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="menu-svg-icon">
                        <path d="M12 2C12 2 4 10.5 4 15.5C4 19.64 7.58 23 12 23C16.42 23 20 19.64 20 15.5C20 10.5 12 2 12 2Z"/>
                    </svg>
                    <span>Programa Agua</span>
                </a>
            </li>

            <li>
                <a routerLink="/programas" routerLinkActive="active">
                    <i class="pi pi-list"></i>
                    <span>Programas</span>
                </a>
            </li>

            <li>
                <a routerLink="/registro" routerLinkActive="active">
                    <i class="pi pi-book"></i>
                    <span>Registro</span>
                </a>
            </li>

            <li>
                <a routerLink="/planes" routerLinkActive="active">
                    <i class="pi pi-check-square"></i>
                    <span>Planes de Saneamiento</span>
                </a>
            </li>

            <li>
                <a routerLink="/programa-residuos" routerLinkActive="active" [routerLinkActiveOptions]="{ paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }">
                    <i class="pi pi-box"></i>
                    <span>Programa Residuos</span>
                </a>
                <a routerLink="/limpieza/programas" routerLinkActive="active">
                    <i class="pi pi-sparkles"></i>
                    <span>Programas de Limpieza</span>
                </a>
            </li>

            <li>
                <a routerLink="/limpieza/equipos" routerLinkActive="active">
                    <i class="pi pi-wrench"></i>
                    <span>Equipos y Áreas</span>
                </a>
            </li>

            <li>
                <a routerLink="/registros" routerLinkActive="active">
                    <i class="pi pi-folder"></i>
                    <span>Registros diarios</span>
                </a>
            </li>

            <li>
                <a routerLink="/documentos" routerLinkActive="active">
                    <i class="pi pi-file"></i>
                    <span>Documentos</span>
                </a>
            </li>

            <li>
                <a routerLink="/reportes" routerLinkActive="active">
                    <i class="pi pi-chart-bar"></i>
                    <span>Reportes</span>
                </a>
            </li>
            <li>
                <a routerLink="/control-plagas" routerLinkActive="active">
                    <i class="pi pi-exclamation-circle"></i>
                    <span>Control de Plagas</span>
                </a>
            </li>
        </ul>
    `,
    styles: [`
        .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .menu-list li {
            margin-bottom: 6px;
        }

        /* ITEM */
        .menu-list a {
            display: flex;
            align-items: center;
            gap: 12px;

            padding: 10px 12px;
            border-radius: 10px;

            color: #374151;
            text-decoration: none;
            font-weight: 500;

            position: relative;
            overflow: hidden;

            transition: all 0.25s ease;
        }

        /* ICONO */
        .menu-list a i,
        .menu-list a .menu-svg-icon {
            font-size: 1rem;
            transition: all 0.25s ease;
        }

        /* 🔥 HOVER */
        .menu-list a:hover {
            background: linear-gradient(90deg, #eef2ff, #f8fafc);
            transform: translateX(6px);
        }

        /* ICONO EN HOVER */
        .menu-list a:hover i,
        .menu-list a:hover .menu-svg-icon {
            transform: scale(1.2);
            color: #2563eb;
        }

        /* ICONO AZUL PERMANENTE */
        .menu-list a i.menu-icon-blue {
            color: #2563eb;
        }

        /* TEXTO EN HOVER */
        .menu-list a:hover span {
            color: #111827;
        }

        /* 🔥 ACTIVO */
        .menu-list a.active {
            background-color: #e8f0fe;
            color: #2563eb;
            font-weight: 600;

            transform: translateX(4px);
        }

        /* BARRA LATERAL ACTIVA */
        .menu-list a.active::before {
            content: "";
            position: absolute;
            left: 0;
            top: 20%;
            height: 60%;
            width: 4px;
            background-color: #2563eb;
            border-radius: 4px;
        }

        /* EFECTO SUAVE DE CLICK */
        .menu-list a:active {
            transform: scale(0.98);
        }
    `]
})
export class AppMenu { }