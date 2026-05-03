import {
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';

import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

import { AppMenu } from './app.menu';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        AppMenu,
        RouterModule,
        ButtonModule,
        RippleModule
    ],
    template: `
        <div class="layout-sidebar flex flex-column h-full">

            <!-- LOGO -->
            <div class="sidebar-header">
                <div class="logo-icon">
                    <i class="pi pi-shield"></i>
                </div>

                <div class="logo-text">
                    <span class="main-title">iPSB Generator</span>
                    <span class="subtitle">Gestión Sanitaria</span>
                </div>
            </div>

            <!-- MENÚ -->
            <div class="sidebar-menu flex-1 overflow-y-auto">
                <app-menu></app-menu>
            </div>

            <!-- BOTÓN INFERIOR -->
            <div class="sidebar-footer">
                <button
                    pButton
                    pRipple
                    label="Nuevo Registro"
                    icon="pi pi-plus-circle"
                    class="new-button p-button-rounded"
                ></button>
            </div>

        </div>
    `,
    styles: [`
        .layout-sidebar {
            width: 280px;        /* 🔥 ESTO ES LO IMPORTANTE */
            min-width: 280px;
            height: 100vh;

            display: flex;
            flex-direction: column;

            background: #ffffff;
            border-right: 1px solid #e5e7eb;
        }

        /* HEADER */
        .sidebar-header {
            display: flex;
            align-items: center;
            padding: 0 1.5rem 1rem 1.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #f1f1f1;
        }

        .logo-icon {
            width: 42px;
            height: 42px;
            background: #eef4ff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }

        .logo-icon i {
            color: #2563eb;
            font-size: 1.4rem;
        }

        .logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }

        .main-title {
            font-size: 1rem;
            font-weight: 700;
            color: #111827;
        }

        .subtitle {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 2px;
        }

        /* MENÚ */
        .sidebar-menu {
            padding: 0 0.75rem;
        }

        /* FOOTER */
        .sidebar-footer {
            padding: 1rem 1rem 0.5rem 1rem;
            margin-top: auto;
        }

        .new-button {
            background-color: #2563eb !important;
            border: none !important;
            min-height: 48px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .new-button:hover {
            background-color: #1d4ed8 !important;
        }
    `]
})
export class AppSidebar implements OnInit, OnDestroy {

    router = inject(Router);
    el = inject(ElementRef);

    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                // no necesitas lógica aquí por ahora
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}