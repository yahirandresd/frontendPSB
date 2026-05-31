import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { DashboardStore } from '../services/dashboard.store';

@Component({
    standalone: true,
    selector: 'app-psb-cumplimiento-widget',
    imports: [CommonModule, ChartModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Cumplimiento por programa</span>
                    <p class="text-muted-color text-sm mt-1">Plan PSB vigente</p>
                </div>
            </div>
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-72" />
        </div>
    `
})
export class PsbCumplimientoWidget {
    layoutService = inject(LayoutService);
    private store = inject(DashboardStore);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    constructor() {
        afterNextRender(() => {
            setTimeout(() => this.initChart(), 150);
        });

        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            this.store.data();
            setTimeout(() => this.initChart(), 150);
        });
    }

    initChart() {
        const doc = getComputedStyle(document.documentElement);
        const textColor = doc.getPropertyValue('--text-color');
        const borderColor = doc.getPropertyValue('--surface-border');
        const textMuted = doc.getPropertyValue('--text-color-secondary');

        const compliance = this.store.data()?.cumplimientoPorPrograma ?? [];
        if (compliance.length === 0) {
            this.chartData.set(null);
            return;
        }

        const labels = compliance.map(c => c.programa);
        const values = compliance.map(c => c.porcentaje);

        const colors = [
            'rgba(16, 185, 129, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(6, 182, 212, 0.85)',
        ];
        const borders = [
            'rgb(16, 185, 129)',
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(6, 182, 212)',
        ];

        this.chartData.set({
            labels,
            datasets: [
                {
                    label: 'Cumplimiento actual (%)',
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: borders.slice(0, labels.length),
                    borderWidth: 1,
                    borderRadius: 6,
                    data: values,
                    barThickness: 40,
                },
                {
                    label: 'Meta (%)',
                    backgroundColor: 'rgba(148, 163, 184, 0.25)',
                    borderColor: 'rgba(148, 163, 184, 0.6)',
                    borderWidth: 1,
                    borderRadius: 6,
                    data: labels.map(() => 100),
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
