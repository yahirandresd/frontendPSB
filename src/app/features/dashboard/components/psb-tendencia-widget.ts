import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    standalone: true,
    selector: 'app-psb-tendencia-widget',
    imports: [ChartModule],
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

        this.chartData.set({
            labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
            datasets: [
                {
                    label: 'Limpieza y Desinfección',
                    data: [12, 14, 10, 16, 18, 15],
                    fill: false,
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Control de Plagas',
                    data: [6, 5, 8, 4, 7, 6],
                    fill: false,
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Residuos Sólidos',
                    data: [8, 10, 9, 11, 10, 12],
                    fill: false,
                    borderColor: '#f59e0b',
                    backgroundColor: '#f59e0b',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Agua Potable',
                    data: [10, 12, 11, 13, 12, 14],
                    fill: false,
                    borderColor: '#06b6d4',
                    backgroundColor: '#06b6d4',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
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
