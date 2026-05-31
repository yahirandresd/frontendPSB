import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DashboardStore } from '../services/dashboard.store';

@Component({
    standalone: true,
    selector: 'app-psb-actividad-widget',
    imports: [CommonModule, RouterModule, ButtonModule, AvatarModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Actividad reciente</span>
                    <p class="text-muted-color text-sm mt-1">Registros de operarios en campo</p>
                </div>
            </div>

            <ul class="p-0 m-0 list-none">
                @for (reg of registros(); track reg.id) {
                    <li class="flex items-center gap-3 py-3" [class.border-b]="!$last" [class.border-surface]="!$last">
                        <p-avatar
                            [label]="reg.iniciales"
                            shape="circle"
                            size="normal"
                            [style]="{ 'background-color': '#3b82f6', 'color': '#fff', 'font-size': '0.75rem' }"
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
                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400': reg.estado === 'completado',
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
                    class="p-button-text p-button-sm w-full justify-center text-primary" routerLink="/programa-agua/registro-agua"></button>
            </div>
        </div>
    `
})
export class PsbActividadWidget {
    private store = inject(DashboardStore);
    registros = computed(() => this.store.data()?.actividadReciente ?? []);
}
