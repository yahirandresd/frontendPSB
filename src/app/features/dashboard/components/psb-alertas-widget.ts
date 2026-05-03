import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface AlertaPSB {
    id: number;
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
                <p-tag [value]="alertas().length + ' activas'" severity="danger" />
            </div>

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

            <div class="mt-4 pt-4 border-t border-surface">
                <button pButton type="button" label="Ver todas las alertas" icon="pi pi-arrow-right" iconPos="right"
                    class="p-button-text p-button-sm w-full justify-center text-primary"></button>
            </div>
        </div>
    `
})
export class PsbAlertasWidget {
    alertas = signal<AlertaPSB[]>([
        {
            id: 1,
            tipo: 'danger',
            icono: 'pi pi-clock',
            iconoColor: 'text-red-500',
            iconoBg: 'bg-red-100 dark:bg-red-400/10',
            titulo: 'Plan PSB próximo a vencer',
            descripcion: 'El Plan PSB v2.1 vence en 8 días. Debe generar y aprobar nueva versión.',
            tiempo: 'Hoy, 9:14 a.m.'
        },
        {
            id: 2,
            tipo: 'danger',
            icono: 'pi pi-times-circle',
            iconoColor: 'text-red-500',
            iconoBg: 'bg-red-100 dark:bg-red-400/10',
            titulo: 'Registro de Control de Plagas atrasado',
            descripcion: 'El operario Juan Pérez no ha registrado la inspección semanal de trampas (3 días de retraso).',
            tiempo: 'Ayer, 6:00 p.m.'
        },
        {
            id: 3,
            tipo: 'warning',
            icono: 'pi pi-exclamation-triangle',
            iconoColor: 'text-orange-500',
            iconoBg: 'bg-orange-100 dark:bg-orange-400/10',
            titulo: 'Cumplimiento de Control de Plagas bajo',
            descripcion: 'El programa alcanzó solo el 65% este mes. Se requieren acciones correctivas.',
            tiempo: 'Hace 2 días'
        },
        {
            id: 4,
            tipo: 'warning',
            icono: 'pi pi-camera',
            iconoColor: 'text-orange-500',
            iconoBg: 'bg-orange-100 dark:bg-orange-400/10',
            titulo: '12 registros pendientes de aprobación',
            descripcion: 'Hay registros fotográficos enviados por operarios que requieren su revisión.',
            tiempo: 'Hace 3 días'
        },
        {
            id: 5,
            tipo: 'info',
            icono: 'pi pi-info-circle',
            iconoColor: 'text-blue-500',
            iconoBg: 'bg-blue-100 dark:bg-blue-400/10',
            titulo: 'Nueva versión de Res. 2674 disponible',
            descripcion: 'Revise si hay ajustes normativos que afecten su plan vigente.',
            tiempo: 'Hace 1 semana'
        }
    ]);
}
