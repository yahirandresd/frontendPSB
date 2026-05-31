import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { AppConfigurator } from './app.configurator';
import { AppUserDrop } from './app.user-drop.component';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { NotificacionService } from '@/app/features/notificaciones/services/notificacion.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, BadgeModule, TooltipModule, AppUserDrop],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="sanifyGradient" x1="10" y1="44" x2="44" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#00C2A8"/>
            <stop offset="100%" stop-color="#123D7A"/>
        </linearGradient>
    </defs>

    <!-- Escudo -->
    <path
        d="M27 4L44 13V28C44 38 36.5 46 27 50C17.5 46 10 38 10 28V13L27 4Z"
        stroke="url(#sanifyGradient)"
        stroke-width="2.8"
        fill="none"
        stroke-linejoin="round"
    />

    <!-- Clipboard -->
    <rect
        x="18"
        y="14"
        width="18"
        height="21"
        rx="2"
        stroke="#123D7A"
        stroke-width="2.4"
        fill="white"
    />

    <!-- Clip superior -->
    <path
        d="M22 14C22 11.8 23.8 10 26 10H28C30.2 10 32 11.8 32 14"
        stroke="#123D7A"
        stroke-width="2.4"
        stroke-linecap="round"
    />

    <rect
        x="22"
        y="10"
        width="10"
        height="4"
        rx="1.5"
        fill="#123D7A"
    />

    <!-- Líneas checklist -->
    <line x1="21" y1="20" x2="33" y2="20" stroke="#123D7A" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="21" y1="25" x2="33" y2="25" stroke="#123D7A" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="21" y1="30" x2="27" y2="30" stroke="#123D7A" stroke-width="2.2" stroke-linecap="round"/>

    <!-- Línea verde -->
    <line x1="21" y1="34" x2="26" y2="34" stroke="#00C2A8" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Badge check -->
    <circle
        cx="35"
        cy="35"
        r="7"
        fill="white"
        stroke="#00C2A8"
        stroke-width="2.5"
    />

    <!-- Check -->
    <path
        d="M32.5 35L34.5 37L38 33.5"
        stroke="#123D7A"
        stroke-width="2.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    />

    <!-- Curva inferior decorativa -->
    <path
        d="M15 42C18 45 22 47 27 49C32 47 36 45 39 42"
        stroke="url(#sanifyGradient)"
        stroke-width="3"
        stroke-linecap="round"
    />
</svg>
                <span>SANIFY</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <button type="button" class="layout-topbar-action relative" (click)="irANotificaciones()"
                pTooltip="Notificaciones" tooltipPosition="bottom">
                <i class="pi pi-bell text-xl"></i>
                <span class="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] !flex items-center justify-center px-1 leading-none shadow-md"
                    [class.bg-red-500]="noLeidas() > 0"
                    [class.bg-surface-400]="noLeidas() === 0">
                    {{ noLeidas() > 99 ? '99+' : noLeidas() }}
                </span>
            </button>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <app-user-drop />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit, OnDestroy {
    items!: MenuItem[];

    layoutService = inject(LayoutService);
    private auth = inject(AuthService);
    private notificacionService = inject(NotificacionService);
    private router = inject(Router);

    noLeidas = signal(0);
    private userId: string | undefined;
    private pollingSub?: Subscription;

    async ngOnInit() {
        const { data } = await this.auth.getSession();
        this.userId = data.session?.user?.id;
        if (this.userId) {
            await this.actualizarContador();
            this.pollingSub = interval(30000).subscribe(() => this.actualizarContador());
        }
    }

    ngOnDestroy() {
        this.pollingSub?.unsubscribe();
    }

    async actualizarContador() {
        if (!this.userId) return;
        try {
            const notis = await firstValueFrom(this.notificacionService.getNoLeidas(this.userId));
            this.noLeidas.set((notis ?? []).filter(n => !n.leida).length);
        } catch { }
    }

    irANotificaciones() {
        this.router.navigate(['/notificaciones']);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
