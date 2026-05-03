import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsbStatsWidget } from './components/psb-stats-widget';
import { PsbCumplimientoWidget } from './components/psb-cumplimiento-widget';
import { PsbAlertasWidget } from './components/psb-alertas-widget';
import { PsbPlanesWidget } from './components/psb-planes-widget';
import { PsbActividadWidget } from './components/psb-actividad-widget';
import { PsbTendenciaWidget } from './components/psb-tendencia-widget';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        PsbStatsWidget,
        PsbCumplimientoWidget,
        PsbAlertasWidget,
        PsbPlanesWidget,
        PsbActividadWidget,
        PsbTendenciaWidget,
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">

            <!-- Header de bienvenida -->
            <div class="col-span-12">
                <div class="card mb-0 flex items-center justify-between">
                    <div>
                        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-2xl mb-1">
                            Bienvenido, {{ nombreAdmin() }}
                        </h2>
                        <p class="text-muted-color text-sm">
                            {{ nombreEmpresa() }} &nbsp;·&nbsp; {{ fechaHoy() }}
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-muted-color">Res. 2674 de 2013</span>
                        <span class="bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            Plan vigente
                        </span>
                    </div>
                </div>
            </div>

            <!-- KPI Cards -->
            <app-psb-stats-widget class="contents" />

            <!-- Columna izquierda -->
            <div class="col-span-12 xl:col-span-7">
                <app-psb-planes-widget />
                <app-psb-actividad-widget />
            </div>

            <!-- Columna derecha -->
            <div class="col-span-12 xl:col-span-5">
                <app-psb-alertas-widget />
            </div>

            <!-- Fila de gráficas -->
            <div class="col-span-12 xl:col-span-6">
                <app-psb-cumplimiento-widget />
            </div>

            <div class="col-span-12 xl:col-span-6">
                <app-psb-tendencia-widget />
            </div>

        </div>
    `
})
export class Dashboard {
    readonly nombreAdmin = signal('Carlos Arbeláez');
    readonly nombreEmpresa = signal('Lácteos del Eje S.A.S.');
    readonly fechaHoy = signal(
        new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    );
}
