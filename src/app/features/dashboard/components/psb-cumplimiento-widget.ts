import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    standalone: true,
    selector: 'app-psb-cumplimiento-widget',
    imports: [ChartModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Cumplimiento por programa</span>
                    <p class="text-muted-color text-sm mt-1">Plan PSB vigente · Lácteos del Eje S.A.S.</p>
                </div>
                <span class="bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                    Riesgo ALTO
                </span>
            </div>
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-72" />
        </div>
    `
})
export class PsbCumplimientoWidget {
    layoutService = inject(LayoutService);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    constructor() {
        afterNextRender(() => {
            setTimeout(() => this.initChart(), 150);
        });

        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            setTimeout(() => this.initChart(), 150);
        });
    }

    initChart() {
        const doc = getComputedStyle(document.documentElement);
        const textColor = doc.getPropertyValue('--text-color');
        const borderColor = doc.getPropertyValue('--surface-border');
        const textMuted = doc.getPropertyValue('--text-color-secondary');
        const primary400 = doc.getPropertyValue('--p-primary-400');
        const primary300 = doc.getPropertyValue('--p-primary-300');

        this.chartData.set({
            labels: ['Limpieza y Desinfección', 'Control de Plagas', 'Residuos Sólidos', 'Agua Potable'],
            datasets: [
                {
                    label: 'Cumplimiento actual (%)',
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.85)',   // emerald
                        'rgba(59, 130, 246, 0.85)',   // blue
                        'rgba(245, 158, 11, 0.85)',   // amber
                        'rgba(6, 182, 212, 0.85)',    // cyan
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(6, 182, 212)',
                    ],
                    borderWidth: 1,
                    borderRadius: 6,
                    data: [82, 65, 90, 74],
                    barThickness: 40,
                },
                {
                    label: 'Meta (%)',
                    backgroundColor: 'rgba(148, 163, 184, 0.25)',
                    borderColor: 'rgba(148, 163, 184, 0.6)',
                    borderWidth: 1,
                    borderRadius: 6,
                    data: [100, 100, 100, 100],
                    barThickness: 40,
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: { color: textColor, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.parsed.x}%`
                    }
                }
            },
            scales: {
                x: {
                    max: 100,
                    ticks: {
                        color: textMuted,
                        callback: (v: number) => v + '%'
                    },
                    grid: { color: borderColor }
                },
                y: {
                    ticks: { color: textColor, font: { size: 12 } },
                    grid: { color: 'transparent' }
                }
            }
        });
    }
}
