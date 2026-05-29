import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RegistroService } from '../../services/registro.service';
import { Registro, EstadoRegistro } from '../../models/registro.interface';
import { ControlPotabilidadService } from '../../../agua/control-potabilidad/services/control-potabilidad.service';
import { ControlPotabilidad } from '../../../agua/control-potabilidad/models/control-potabilidad.interface';
import { AnalisisLaboratorioService } from '../../../agua/analisis-laboratorio/services/analisis-laboratorio.service';
import { AnalisisLaboratorio } from '../../../agua/analisis-laboratorio/models/analisis-laboratorio.interface';
import { MantenimientoLavadoService } from '../../../agua/mantenimiento-lavado/services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../../agua/mantenimiento-lavado/models/mantenimiento-lavado.interface';
import { AccionCorrectivaAguaService } from '../../../agua/accion-correctiva-agua/services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../../agua/accion-correctiva-agua/models/accion-correctiva-agua.interface';
import { RegistroAguaService } from '../../../agua/registro-agua/services/registro-agua.service';

@Component({
    selector: 'app-registro-detail',
    standalone: true,
    imports: [
        CommonModule, RouterModule, ButtonModule, TabsModule, AccordionModule,
        TableModule, TagModule, ToastModule,
    ],
    templateUrl: './registro-detail.component.html',
    styleUrls: ['./registro-detail.component.scss'],
    providers: [MessageService],
})
export class RegistroDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private registroService = inject(RegistroService);
    private registroAguaService = inject(RegistroAguaService);
    private controlService = inject(ControlPotabilidadService);
    private analisisService = inject(AnalisisLaboratorioService);
    private mantenimientoService = inject(MantenimientoLavadoService);
    private accionCorrectivaService = inject(AccionCorrectivaAguaService);
    private messageService = inject(MessageService);

    registro = signal<Registro | null>(null);
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
            const reg = await firstValueFrom(this.registroService.getById(id));
            this.registro.set(reg);

            const registroAguaId = reg.agua?.[0]?.id;
            if (registroAguaId) {
                const promises: Promise<any>[] = [
                    firstValueFrom(this.controlService.getByRegistro(registroAguaId)).then(r => this.controles.set(r)).catch(() => {}),
                    firstValueFrom(this.analisisService.getByRegistro(registroAguaId)).then(r => this.analisis.set(r)).catch(() => {}),
                    firstValueFrom(this.mantenimientoService.getByRegistro(registroAguaId)).then(r => this.mantenimientos.set(r)).catch(() => {}),
                    firstValueFrom(this.accionCorrectivaService.getByRegistro(registroAguaId)).then(r => this.accionesCorrectivas.set(r)).catch(() => {}),
                ];
                await Promise.all(promises);
            }
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el detalle del registro' });
        } finally {
            this.loading.set(false);
        }
    }

    estadoSeverity(estado: EstadoRegistro): 'success' | 'info' | 'warn' | 'danger' {
        const map: Record<EstadoRegistro, 'success' | 'info' | 'warn' | 'danger'> = { completado: 'success', en_proceso: 'info', pendiente: 'warn', rechazado: 'danger' };
        return map[estado];
    }
}
