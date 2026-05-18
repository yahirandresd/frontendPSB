import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ControlPlagasService } from '../../services/control-plagas.service';
import { ProgramaControlPlagas, Inspeccion } from '../../models';

@Component({
  selector: 'app-dashboard-plagas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="dashboard">
      <h2>Control de plagas</h2>

      <!-- Alertas activas -->
      @if (service.hayAlertas()) {
        <div class="alerta-banner">
          Tienes {{ service.alertas().length }} alerta(s) pendientes
        </div>
      }

      <!-- Tarjetas de acceso rápido -->
      <div class="grid">
        <a routerLink="diagnostico"        class="card">Diagnóstico inicial</a>
        <a routerLink="inspecciones"       class="card">Inspecciones</a>
        <a routerLink="hallazgos"          class="card">Hallazgos</a>
        <a routerLink="acciones-correctivas" class="card">Acciones correctivas</a>
        <a routerLink="empresa-fumigadora" class="card">Empresa fumigadora</a>
        <a routerLink="cronograma"         class="card">Cronograma</a>
        <a routerLink="plaguicidas"        class="card">Plaguicidas</a>
        <a routerLink="trampas"            class="card">Trampas</a>
        <a routerLink="reportes"           class="card">Reportes</a>
      </div>

      <!-- Indicador de cumplimiento -->
      @if (programa) {
        <div class="cumplimiento">
          <span>Cumplimiento del programa</span>
          <strong>{{ cumplimiento | number:'1.0-0' }}%</strong>
          <progress [value]="cumplimiento" max="100"></progress>
        </div>
      }
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  protected service = inject(ControlPlagasService);

  programa: ProgramaControlPlagas | null = null;
  inspecciones: Inspeccion[] = [];
  cumplimiento = 0;

  // empresaId vendría del AuthService o un store compartido con tus compañeros
  private empresaId = 'empresa-123';

  ngOnInit(): void {
    this.service.cargarPrograma(this.empresaId).subscribe(p => {
      this.programa = p;
    });

    this.service.listarInspecciones(this.empresaId).subscribe(list => {
      this.inspecciones = list;
      if (this.programa) {
        this.cumplimiento = this.service.calcularCumplimiento(
          this.programa,
          this.inspecciones
        );
      }
    });
  }
}
