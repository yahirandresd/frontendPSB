import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { NotificacionService } from '@/app/features/notificaciones/services/notificacion.service';

interface AlertaPSB {
    id: string;
    tipo: 'danger' | 'warning' | 'info';
    icono: string;
    iconoColor: string;
    iconoBg: string;
    titulo: string;
    descripcion: string;
    tiempo: string;
}

@Component({
    standalone: true,
    selector: 'app-psb-alertas-widget',
    imports: [CommonModule, ButtonModule, TagModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div class="font-semibold text-xl">Alertas y notificaciones</div>
                @if (alertas().length > 0) {
                    <p-tag [value]="alertas().length + ' activas'" severity="danger" />
                }
            </div>

            @if (cargando()) {
                <div class="flex items-center justify-center py-4">
                    <i class="pi pi-spin pi-spinner text-xl text-muted-color"></i>
                </div>
            } @else if (alertas().length === 0) {
                <div class="flex flex-col items-center py-6 text-muted-color">
                    <i class="pi pi-check-circle text-3xl mb-2 text-green-500"></i>
                    <p class="text-sm">No hay alertas activas</p>
                </div>
            } @else {
                <ul class="p-0 m-0 list-none">
                    @for (alerta of alertas(); track alerta.id) {
                        <li class="flex items-start gap-4 py-3" [class.border-b]="!$last" [class.border-surface]="!$last">
                            <div
                                class="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                                [class]="alerta.iconoBg"
                                style="width:2.5rem;height:2.5rem"
                            >
                                <i [class]="alerta.icono + ' text-xl! ' + alerta.iconoColor"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-surface-900 dark:text-surface-0 mb-1 leading-snug">
                                    {{ alerta.titulo }}
                                </p>
                                <p class="text-muted-color text-sm leading-normal mb-1">{{ alerta.descripcion }}</p>
                                <span class="text-xs text-muted-color">{{ alerta.tiempo }}</span>
                            </div>
                            <span
                                class="shrink-0 text-xs font-semibold px-2 py-1 rounded-full"
                                [ngClass]="{
                                    'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400': alerta.tipo === 'danger',
                                    'bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400': alerta.tipo === 'warning',
                                    'bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400': alerta.tipo === 'info'
                                }"
                            >
                                {{ alerta.tipo === 'danger' ? 'Crítica' : alerta.tipo === 'warning' ? 'Advertencia' : 'Info' }}
                            </span>
                        </li>
                    }
                </ul>
            }

            <div class="mt-4 pt-4 border-t border-surface">
                <button pButton type="button" label="Ver todas las notificaciones" icon="pi pi-arrow-right" iconPos="right"
                    class="p-button-text p-button-sm w-full justify-center text-primary"
                    (click)="router.navigate(['/notificaciones'])"></button>
            </div>
        </div>
    `
})
export class PsbAlertasWidget implements OnInit {
    private auth = inject(AuthService);
    private notificacionService = inject(NotificacionService);
    router = inject(Router);

    alertas = signal<AlertaPSB[]>([]);
    cargando = signal(false);

    async ngOnInit() {
        await this.cargarAlertas();
    }

    async cargarAlertas() {
        this.cargando.set(true);
        try {
            const { data } = await this.auth.getSession();
            const userId = data.session?.user?.id;
            if (!userId) return;
            const notis = await firstValueFrom(this.notificacionService.getNoLeidas(userId));
            this.alertas.set(notis.filter(n => !n.leida).map(n => ({
                id: n.id,
                tipo: n.tipo === 'alerta' ? 'danger' : n.tipo === 'vencimiento' ? 'warning' : 'info',
                icono: n.tipo === 'alerta' ? 'pi pi-exclamation-triangle' : n.tipo === 'vencimiento' ? 'pi pi-clock' : 'pi pi-info-circle',
                iconoColor: n.tipo === 'alerta' ? 'text-red-500' : n.tipo === 'vencimiento' ? 'text-orange-500' : 'text-blue-500',
                iconoBg: n.tipo === 'alerta' ? 'bg-red-100 dark:bg-red-400/10' : n.tipo === 'vencimiento' ? 'bg-orange-100 dark:bg-orange-400/10' : 'bg-blue-100 dark:bg-blue-400/10',
                titulo: n.titulo,
                descripcion: n.mensaje,
                tiempo: n.fechaEnvio ? new Date(n.fechaEnvio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
            })));
        } catch {
            this.alertas.set([]);
        } finally {
            this.cargando.set(false);
        }
    }
}
