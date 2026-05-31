import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DashboardStore } from '../services/dashboard.store';

type RiesgoNivel = 'ALTO' | 'MEDIO' | 'BAJO';
type PlanEstado = 'ACTIVO' | 'BORRADOR' | 'VENCIDO' | 'EN_REVISION';

@Component({
    standalone: true,
    selector: 'app-psb-planes-widget',
    imports: [CommonModule, RouterModule, ButtonModule, TagModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Planes PSB</span>
                    <p class="text-muted-color text-sm mt-1">Historial de versiones y estado</p>
                </div>
                <button pButton type="button" label="Nuevo plan" icon="pi pi-plus"
                    class="p-button-sm p-button-outlined" routerLink="/planes/crear"></button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-surface">
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Plan / Versión</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Riesgo</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Estado</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Vence</th>
                            <th class="text-left text-muted-color font-medium pb-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (plan of planes(); track plan.id) {
                            <tr class="border-b border-surface last:border-0 hover:bg-surface-hover transition-colors">
                                <td class="py-3 pr-4">
                                    <div class="font-medium text-surface-900 dark:text-surface-0">{{ plan.nombre }}</div>
                                    <div class="text-muted-color text-xs mt-0.5">{{ plan.version }}</div>
                                </td>
                                <td class="py-3 pr-4">
                                    <span
                                        class="text-xs font-semibold px-2 py-1 rounded-full"
                                        [ngClass]="{
                                            'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400': plan.nivelRiesgo === 'ALTO',
                                            'bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400': plan.nivelRiesgo === 'MEDIO',
                                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400': plan.nivelRiesgo === 'BAJO'
                                        }"
                                    >{{ plan.nivelRiesgo }}</span>
                                </td>
                                <td class="py-3 pr-4">
                                    <p-tag
                                        [value]="estadoLabel(plan.estado)"
                                        [severity]="estadoSeverity(plan.estado)"
                                    />
                                </td>
                                <td class="py-3 pr-4">
                                    <span class="text-xs text-muted-color">{{ plan.vencimiento }}</span>
                                </td>
                                <td class="py-3">
                                    <button pButton type="button" icon="pi pi-eye"
                                        class="p-button-rounded p-button-text p-button-plain p-button-sm"
                                        pTooltip="Ver plan" [routerLink]="['/planes', plan.id]"></button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class PsbPlanesWidget {
    private store = inject(DashboardStore);

    planes = computed(() => this.store.data()?.planes ?? []);

    estadoLabel(estado: string): string {
        const labels: Record<string, string> = {
            ACTIVO: 'Activo',
            BORRADOR: 'Borrador',
            VENCIDO: 'Vencido',
            EN_REVISION: 'En revisión'
        };
        return labels[estado] ?? estado;
    }

    estadoSeverity(estado: string): 'success' | 'danger' | 'secondary' | 'warn' {
        const map: Record<string, 'success' | 'danger' | 'secondary' | 'warn'> = {
            ACTIVO: 'success',
            BORRADOR: 'secondary',
            VENCIDO: 'danger',
            EN_REVISION: 'warn'
        };
        return map[estado] ?? 'secondary';
    }
}
