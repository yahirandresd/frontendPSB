import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

type RiesgoNivel = 'ALTO' | 'MEDIO' | 'BAJO';
type PlanEstado = 'ACTIVO' | 'BORRADOR' | 'VENCIDO' | 'EN_REVISION';

interface PlanResumen {
    id: string;
    nombre: string;
    version: string;
    nivelRiesgo: RiesgoNivel;
    estado: PlanEstado;
    cumplimiento: number;
    vencimiento: string;
}

@Component({
    standalone: true,
    selector: 'app-psb-planes-widget',
    imports: [CommonModule, ButtonModule, TagModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Planes PSB</span>
                    <p class="text-muted-color text-sm mt-1">Historial de versiones y estado</p>
                </div>
                <button pButton type="button" label="Nuevo plan" icon="pi pi-plus"
                    class="p-button-sm p-button-outlined"></button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-surface">
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Plan / Versión</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Riesgo</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Estado</th>
                            <th class="text-left text-muted-color font-medium pb-3 pr-4">Cumplimiento</th>
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
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 min-w-16">
                                            <div
                                                class="h-1.5 rounded-full transition-all"
                                                [style.width.%]="plan.cumplimiento"
                                                [ngClass]="{
                                                    'bg-emerald-500': plan.cumplimiento >= 80,
                                                    'bg-orange-400': plan.cumplimiento >= 60 && plan.cumplimiento < 80,
                                                    'bg-red-500': plan.cumplimiento < 60
                                                }"
                                            ></div>
                                        </div>
                                        <span class="text-xs font-medium text-surface-700 dark:text-surface-200 min-w-8">{{ plan.cumplimiento }}%</span>
                                    </div>
                                </td>
                                <td class="py-3 pr-4">
                                    <span
                                        class="text-xs"
                                        [ngClass]="{
                                            'text-red-500 font-medium': esProximoAVencer(plan.vencimiento),
                                            'text-muted-color': !esProximoAVencer(plan.vencimiento)
                                        }"
                                    >{{ plan.vencimiento }}</span>
                                </td>
                                <td class="py-3">
                                    <button pButton type="button" icon="pi pi-eye"
                                        class="p-button-rounded p-button-text p-button-plain p-button-sm"
                                        pTooltip="Ver plan"></button>
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
    planes = signal<PlanResumen[]>([
        {
            id: '1',
            nombre: 'PSB Lácteos del Eje',
            version: 'v2.1 · vigente',
            nivelRiesgo: 'ALTO',
            estado: 'ACTIVO',
            cumplimiento: 78,
            vencimiento: '11 may 2026'
        },
        {
            id: '2',
            nombre: 'PSB Lácteos del Eje',
            version: 'v2.0 · anterior',
            nivelRiesgo: 'ALTO',
            estado: 'VENCIDO',
            cumplimiento: 85,
            vencimiento: '11 may 2025'
        },
        {
            id: '3',
            nombre: 'PSB Punto de Venta Manizales',
            version: 'v1.0 · borrador',
            nivelRiesgo: 'MEDIO',
            estado: 'BORRADOR',
            cumplimiento: 0,
            vencimiento: 'Sin fecha'
        },
        {
            id: '4',
            nombre: 'PSB Distribución Bogotá',
            version: 'v1.2 · en revisión',
            nivelRiesgo: 'BAJO',
            estado: 'EN_REVISION',
            cumplimiento: 62,
            vencimiento: '30 jun 2026'
        }
    ]);

    estadoLabel(estado: PlanEstado): string {
        const labels: Record<PlanEstado, string> = {
            ACTIVO: 'Activo',
            BORRADOR: 'Borrador',
            VENCIDO: 'Vencido',
            EN_REVISION: 'En revisión'
        };
        return labels[estado];
    }

    estadoSeverity(estado: PlanEstado): 'success' | 'danger' | 'secondary' | 'warn' {
        const map: Record<PlanEstado, 'success' | 'danger' | 'secondary' | 'warn'> = {
            ACTIVO: 'success',
            BORRADOR: 'secondary',
            VENCIDO: 'danger',
            EN_REVISION: 'warn'
        };
        return map[estado];
    }

    esProximoAVencer(fecha: string): boolean {
        // Marca en rojo fechas que incluyan "may 2026" como dato mock representativo
        return fecha.includes('may 2026');
    }
}
