import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-psb-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Planes PSB activos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">3 / 4</div>
                    </div>
                    <div class="flex items-center justify-center bg-emerald-100 dark:bg-emerald-400/10 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-file-check text-emerald-600 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">1 en revisión </span>
                <span class="text-muted-color">· versión vigente</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Cumplimiento general</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">78%</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-chart-bar text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-emerald-600 font-medium">+6% </span>
                <span class="text-muted-color">respecto al mes anterior</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Registros del mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">47</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-camera text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">12 pendientes </span>
                <span class="text-muted-color">de aprobación</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Alertas activas</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">5</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-exclamation-triangle text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-red-500 font-medium">2 críticas </span>
                <span class="text-muted-color">· 3 de advertencia</span>
            </div>
        </div>
    `
})
export class PsbStatsWidget {}
