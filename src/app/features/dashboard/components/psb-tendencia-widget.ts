import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { DashboardStore } from '../services/dashboard.store';

@Component({
    standalone: true,
    selector: 'app-psb-tendencia-widget',
    imports: [CommonModule, ChartModule],
    template: `
        <div class="card mb-8!">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="font-semibold text-xl">Tendencia de registros</span>
                    <p class="text-muted-color text-sm mt-1">Últimos 6 meses · todos los programas</p>
                </div>
            </div>
            <p-chart type="line" [data]="chartData()" [options]="chartOptions()" class="h-64" />
        </div>
    `
})
export class PsbTendenciaWidget {
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

        const tendencia = this.store.data()?.tendenciaMensual;
        if (!tendencia || tendencia.series.length === 0) {
            this.chartData.set(null);
            return;
        }

        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#06b6d4'];

        this.chartData.set({
            labels: tendencia.meses,
            datasets: tendencia.series.map((s, i) => ({
                label: s.programa,
                data: s.datos,
                fill: false,
                borderColor: colors[i % colors.length],
                backgroundColor: colors[i % colors.length],
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            })),
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { size: 11 },
                        boxWidth: 12,
                        padding: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textMuted },
                    grid: { color: 'transparent' }
                },
                y: {
                    ticks: { color: textMuted, stepSize: 5 },
                    grid: { color: borderColor }
                }
            }
        });
    }
}
