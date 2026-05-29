import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { environment } from '@/environments/environment';

interface EstadisticasPlagas {
  totalRegistros: number;
  totalHallazgos: number;
  hallazgosPorSeveridad: { severidad: string; total: number }[];
  totalTrampas: number;
  totalAreas: number;
  totalPlaguicidas: number;
  hallazgosAbiertos: number;
  hallazgosCerrados: number;
}

@Component({
  selector: 'app-estadisticas-plagas',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, SkeletonModule],
  template: `
    <div class="card">
      <div class="flex items-center mb-6">
        <h5 class="text-xl font-semibold text-surface-900 dark:text-surface-0">
          <i class="pi pi-chart-bar mr-2"></i>Estadísticas del Programa
        </h5>
      </div>

      @if (cargando) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (i of [1,2,3,4,5,6]; track i) {
            <p-skeleton height="100px" borderRadius="12px" />
          }
        </div>
      } @else if (stats) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Total Registros</div>
            <div class="text-3xl font-bold text-primary">{{ stats.totalRegistros }}</div>
          </div>

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Total Hallazgos</div>
            <div class="text-3xl font-bold text-orange-500">{{ stats.totalHallazgos }}</div>
          </div>

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Hallazgos Abiertos</div>
            <div class="text-3xl font-bold text-red-500">{{ stats.hallazgosAbiertos }}</div>
          </div>

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Hallazgos Cerrados</div>
            <div class="text-3xl font-bold text-green-500">{{ stats.hallazgosCerrados }}</div>
          </div>

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Trampas Instaladas</div>
            <div class="text-3xl font-bold text-blue-500">{{ stats.totalTrampas }}</div>
          </div>

          <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-xl">
            <div class="text-muted-color text-sm mb-1">Áreas Evaluadas</div>
            <div class="text-3xl font-bold text-purple-500">{{ stats.totalAreas }}</div>
          </div>

        </div>

        @if (stats.hallazgosPorSeveridad.length) {
          <div class="mt-6">
            <h6 class="font-semibold mb-3">Hallazgos por Severidad</h6>
            <div class="flex flex-wrap gap-3">
              @for (item of stats.hallazgosPorSeveridad; track item.severidad) {
                <div class="flex items-center gap-2 p-3 border border-surface-200 dark:border-surface-700 rounded-lg">
                  <p-tag [value]="item.severidad" [severity]="getSeveridad(item.severidad)" />
                  <span class="font-bold text-lg">{{ item.total }}</span>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center text-muted-color py-10">
          <i class="pi pi-info-circle text-4xl mb-3 block"></i>
          No hay estadísticas disponibles para este programa.
        </div>
      }
    </div>
  `
})
export class EstadisticasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  stats: EstadisticasPlagas | null = null;
  cargando = false;

  ngOnInit(): void {
    // Obtiene el programaId del padre en la jerarquía de rutas
    const programaId = this.route.parent?.snapshot.params['programaId'];
    if (programaId) {
      this.cargarEstadisticas(programaId);
    }
  }

  cargarEstadisticas(programaId: string): void {
    this.cargando = true;
    this.http
      .get<EstadisticasPlagas>(
        `${environment.apiUrl}/programa-plagas/${programaId}/estadisticas`
      )
      .subscribe({
        next: (data) => { this.stats = data; this.cargando = false; },
        error: () => { this.cargando = false; }
      });
  }

  getSeveridad(s: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, any> = {
      leve: 'info',
      moderado: 'warn',
      grave: 'danger',
      critico: 'danger'
    };
    return map[s] ?? 'info';
  }
}
