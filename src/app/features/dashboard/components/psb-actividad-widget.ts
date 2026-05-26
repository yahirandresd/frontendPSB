import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

interface RegistroActividad {
    id: number;
    operario: string;
    iniciales: string;
    colorAvatar: string;
    programa: string;
    accion: string;
    estado: 'aprobado' | 'pendiente' | 'rechazado';
    tiempo: string;
    tieneFoto: boolean;
}

@Component({
    standalone: true,
    selector: 'app-psb-actividad-widget',
    imports: [CommonModule, ButtonModule, AvatarModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Actividad reciente</span>
                    <p class="text-muted-color text-sm mt-1">Registros de operarios en campo</p>
                </div>
                <span class="bg-orange-100 dark:bg-orange-400/10 text-orange-700 dark:text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
                    12 pendientes
                </span>
            </div>

            <ul class="p-0 m-0 list-none">
                @for (reg of registros(); track reg.id) {
                    <li class="flex items-center gap-3 py-3" [class.border-b]="!$last" [class.border-surface]="!$last">
                        <p-avatar
                            [label]="reg.iniciales"
                            shape="circle"
                            size="normal"
                            [style]="{ 'background-color': reg.colorAvatar, 'color': '#fff', 'font-size': '0.75rem' }"
                        />
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-surface-900 dark:text-surface-0 text-sm mb-0.5">
                                {{ reg.operario }}
                                <span class="text-muted-color font-normal">registró en</span>
                                {{ reg.programa }}
                            </p>
                            <p class="text-muted-color text-xs">{{ reg.accion }}</p>
                        </div>
                        @if (reg.tieneFoto) {
                            <i class="pi pi-image text-muted-color text-sm shrink-0"></i>
                        }
                        <div class="flex flex-col items-end gap-1 shrink-0">
                            <span
                                class="text-xs font-semibold px-2 py-0.5 rounded-full"
                                [ngClass]="{
                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400': reg.estado === 'aprobado',
                                    'bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400': reg.estado === 'pendiente',
                                    'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400': reg.estado === 'rechazado'
                                }"
                            >{{ reg.estado }}</span>
                            <span class="text-xs text-muted-color">{{ reg.tiempo }}</span>
                        </div>
                    </li>
                }
            </ul>

            <div class="mt-4 pt-4 border-t border-surface">
                <button pButton type="button" label="Ver todos los registros" icon="pi pi-arrow-right" iconPos="right"
                    class="p-button-text p-button-sm w-full justify-center text-primary"></button>
            </div>
        </div>
    `
})
export class PsbActividadWidget {
    registros = signal<RegistroActividad[]>([
        {
            id: 1,
            operario: 'Juan Pérez',
            iniciales: 'JP',
            colorAvatar: '#10b981',
            programa: 'Limpieza y Desinfección',
            accion: 'Desinfección de superficies zona de producción',
            estado: 'aprobado',
            tiempo: 'Hace 1h',
            tieneFoto: true
        },
        {
            id: 2,
            operario: 'María López',
            iniciales: 'ML',
            colorAvatar: '#3b82f6',
            programa: 'Agua Potable',
            accion: 'Medición de cloro residual — 0.8 ppm',
            estado: 'pendiente',
            tiempo: 'Hace 3h',
            tieneFoto: true
        },
        {
            id: 3,
            operario: 'Carlos Ríos',
            iniciales: 'CR',
            colorAvatar: '#f59e0b',
            programa: 'Control de Plagas',
            accion: 'Revisión de trampas pegantes zona almacén',
            estado: 'pendiente',
            tiempo: 'Hace 5h',
            tieneFoto: false
        },
        {
            id: 4,
            operario: 'Ana Gómez',
            iniciales: 'AG',
            colorAvatar: '#8b5cf6',
            programa: 'Residuos Sólidos',
            accion: 'Pesaje y disposición de residuos orgánicos',
            estado: 'aprobado',
            tiempo: 'Ayer',
            tieneFoto: true
        },
        {
            id: 5,
            operario: 'Juan Pérez',
            iniciales: 'JP',
            colorAvatar: '#10b981',
            programa: 'Control de Plagas',
            accion: 'Registro incompleto — falta fotografía de evidencia',
            estado: 'rechazado',
            tiempo: 'Hace 2 días',
            tieneFoto: false
        }
    ]);
}
