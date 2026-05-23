import { afterNextRender, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@/app/layout/service/layout.service';
import { ProgramaResiduosStore } from '../../services/programa-residuos.store';
import {
    ESTADO_REGISTRO_LABELS,
    ESTADO_REGISTRO_SEVERITY,
    TagSeverity,
    TIPO_ACTIVIDAD_LABELS
} from '../../utils/programa-residuos.labels';
import { EstadoRegistro } from '../../models/programa-residuos.models';

@Component({
    selector: 'app-pr-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, TagModule, ButtonModule, RouterLink],
    templateUrl: './pr-dashboard.component.html',
    styleUrls: ['./pr-dashboard.component.scss']
})
export class PrDashboardComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly layoutService = inject(LayoutService);

    readonly stats = this.store.stats;
    readonly actLabels = ESTADO_REGISTRO_LABELS;
    readonly actSeverity = ESTADO_REGISTRO_SEVERITY;
    readonly tipoLabels = TIPO_ACTIVIDAD_LABELS;

    readonly ultimasActividades = computed(() => {
        const list: { id: string; tipo_actividad: string; resultado_general: string; fecha: string; estado: EstadoRegistro; programaNombre: string }[] = [];
        this.store.programasList().forEach((p) => {
            p.programaResiduo?.registros.forEach((rr) => {
                list.push({
                    id: rr.id,
                    tipo_actividad: rr.tipo_actividad,
                    resultado_general: rr.resultado_general,
                    fecha: rr.registro?.fecha || '',
                    estado: rr.registro?.estado || EstadoRegistro.PENDIENTE,
                    programaNombre: p.nombre
                });
            });
        });
        return list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5);
    });

    readonly proximasRecolecciones = computed(() =>
        this.store
            .recoleccionesList()
            .filter((r) => r.estado === EstadoRegistro.PENDIENTE || r.estado === EstadoRegistro.EN_PROCESO)
            .slice(0, 4)
    );

    readonly alertas = computed(() => {
        const items: { tipo: string; mensaje: string; severity: TagSeverity }[] = [];
        const s = this.stats();
        if (s.actividadesAtrasadas > 0) {
            items.push({
                tipo: 'Actividades',
                accent: 'atrasadas',
                mensaje: `${s.actividadesAtrasadas} actividad(es) con fecha vencida`,
                severity: 'danger'
            } as any);
        }
        if (s.recoleccionesPendientes > 0) {
            items.push({
                tipo: 'Recolecciones',
                accent: 'pendientes',
                mensaje: `${s.recoleccionesPendientes} recolección(es) pendientes`,
                severity: 'warn'
            } as any);
        }
        if (s.cumplimientoGeneral < 60) {
            items.push({
                tipo: 'Cumplimiento',
                accent: 'bajo',
                mensaje: `Cumplimiento general bajo (${s.cumplimientoGeneral}%)`,
                severity: 'danger'
            } as any);
        }
        return items;
    });

    chartEstado = signal<unknown>(null);
    chartEstadoOpts = signal<unknown>(null);
    chartCumplimiento = signal<unknown>(null);
    chartCumplimientoOpts = signal<unknown>(null);
    chartResiduos = signal<unknown>(null);
    chartResiduosOpts = signal<unknown>(null);
    chartActividades = signal<unknown>(null);
    chartActividadesOpts = signal<unknown>(null);

    constructor() {
        afterNextRender(() => setTimeout(() => this.initCharts(), 150));
        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            this.store.programasList();
            this.store.recoleccionesList();
            setTimeout(() => this.initCharts(), 150);
        });
    }

    private initCharts(): void {
        const doc = getComputedStyle(document.documentElement);
        const textColor = doc.getPropertyValue('--text-color');
        const borderColor = doc.getPropertyValue('--surface-border');
        const textMuted = doc.getPropertyValue('--text-color-secondary');

        const progs = this.store.programasList();
        const porEstado = {
            pendiente: 0,
            en_proceso: 0,
            completado: 0,
            rechazado: 0
        };
        progs.forEach((p) => {
            const regs = p.registros || [];
            const status = regs.length > 0 ? regs[regs.length - 1].estado : EstadoRegistro.PENDIENTE;
            porEstado[status]++;
        });

        this.chartEstado.set({
            labels: ['Pendiente', 'En Proceso', 'Completado', 'Rechazado'],
            datasets: [
                {
                    data: [porEstado.pendiente, porEstado.en_proceso, porEstado.completado, porEstado.rechazado],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
                }
            ]
        });
        this.chartEstadoOpts.set(this.pieOpts(textColor));

        this.chartCumplimiento.set({
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [
                {
                    label: 'Cumplimiento %',
                    data: [62, 68, 71, 75, this.stats().cumplimientoGeneral],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.4
                }
            ]
        });
        this.chartCumplimientoOpts.set(this.lineOpts(textColor, borderColor, textMuted));

        const recs = this.store.recoleccionesList();
        this.chartResiduos.set({
            labels: recs.map((r) => r.fecha.slice(5)),
            datasets: [
                {
                    label: 'Kg recolectados',
                    data: recs.map((r) => r.cantidad_recolectada),
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                    borderRadius: 6
                }
            ]
        });
        this.chartResiduosOpts.set(this.barOpts(textColor, borderColor, textMuted));

        const acts = progs.flatMap((p) => p.programaResiduo?.registros || []);
        const completadas = acts.filter((a) => a.registro?.estado === EstadoRegistro.COMPLETADO).length;
        const pendientes = acts.length - completadas;
        this.chartActividades.set({
            labels: ['Completadas', 'Pendientes / en proceso'],
            datasets: [{ data: [completadas, pendientes], backgroundColor: ['#10b981', '#f59e0b'] }]
        });
        this.chartActividadesOpts.set(this.pieOpts(textColor));
    }

    private pieOpts(textColor: string) {
        return {
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } }
        };
    }

    private lineOpts(textColor: string, borderColor: string, textMuted: string) {
        return {
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textMuted }, grid: { color: borderColor } },
                y: {
                    max: 100,
                    ticks: { color: textMuted, callback: (v: number) => v + '%' },
                    grid: { color: borderColor }
                }
            }
        };
    }

    private barOpts(textColor: string, borderColor: string, textMuted: string) {
        return {
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textMuted }, grid: { color: borderColor } },
                y: { ticks: { color: textMuted }, grid: { color: borderColor } }
            }
        };
    }
}

