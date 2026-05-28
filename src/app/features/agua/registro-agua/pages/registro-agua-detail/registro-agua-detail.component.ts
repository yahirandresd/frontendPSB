import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RegistroAguaService } from '../../services/registro-agua.service';
import { RegistroAgua } from '../../models/registro-agua.interface';
import { ControlPotabilidadService } from '../../../control-potabilidad/services/control-potabilidad.service';
import { ControlPotabilidad } from '../../../control-potabilidad/models/control-potabilidad.interface';
import { AnalisisLaboratorioService } from '../../../analisis-laboratorio/services/analisis-laboratorio.service';
import { AnalisisLaboratorio } from '../../../analisis-laboratorio/models/analisis-laboratorio.interface';
import { MantenimientoLavadoService } from '../../../mantenimiento-lavado/services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../../mantenimiento-lavado/models/mantenimiento-lavado.interface';
import { AccionCorrectivaAguaService } from '../../../accion-correctiva-agua/services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../../accion-correctiva-agua/models/accion-correctiva-agua.interface';
@Component({
    selector: 'app-registro-agua-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, AccordionModule, TableModule, TagModule, ToastModule],
    templateUrl: './registro-agua-detail.component.html',
    styleUrls: ['./registro-agua-detail.component.scss'],
    providers: [MessageService],
})
export class RegistroAguaDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private registroAguaService = inject(RegistroAguaService);
    private controlService = inject(ControlPotabilidadService);
    private analisisService = inject(AnalisisLaboratorioService);
    private mantenimientoService = inject(MantenimientoLavadoService);
    private accionCorrectivaService = inject(AccionCorrectivaAguaService);
    private messageService = inject(MessageService);

    registroAgua = signal<RegistroAgua | null>(null);
    controles = signal<ControlPotabilidad[]>([]);
    analisis = signal<AnalisisLaboratorio[]>([]);
    mantenimientos = signal<MantenimientoLavado[]>([]);
    accionesCorrectivas = signal<AccionCorrectivaAgua[]>([]);
    loading = signal(true);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.cargar(id);
    }

    async cargar(id: string) {
        this.loading.set(true);
        try {
            const ra = await firstValueFrom(this.registroAguaService.getById(id));
            this.registroAgua.set(ra);

            const promises: Promise<any>[] = [
                firstValueFrom(this.controlService.getByRegistro(id)).then(r => this.controles.set(r)).catch(() => {}),
                firstValueFrom(this.analisisService.getByRegistro(id)).then(r => this.analisis.set(r)).catch(() => {}),
                firstValueFrom(this.mantenimientoService.getByRegistro(id)).then(r => this.mantenimientos.set(r)).catch(() => {}),
                firstValueFrom(this.accionCorrectivaService.getByRegistro(id)).then(r => this.accionesCorrectivas.set(r)).catch(() => {}),
            ];
            await Promise.all(promises);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el registro' });
        } finally {
            this.loading.set(false);
        }
    }

    resultColor(resultado: string): 'success' | 'danger' | 'warn' | 'info' {
        switch (resultado) {
            case 'conforme': return 'success';
            case 'no_conforme': return 'danger';
            case 'en_proceso': return 'warn';
            default: return 'info';
        }
    }

    volver() { this.location.back(); }

    tipoLabel(tipo: string): string {
        const labels: Record<string, string> = {
            control_potabilidad: 'Control Diario de Potabilidad',
            analisis_laboratorio: 'Análisis de Laboratorio',
            mantenimiento_lavado: 'Mantenimiento y Lavado',
            accion_correctiva: 'Acción Correctiva',
        };
        return labels[tipo] ?? tipo;
    }
}
