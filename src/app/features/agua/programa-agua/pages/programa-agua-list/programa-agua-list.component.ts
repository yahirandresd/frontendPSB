import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgramaAguaService } from '../../services/programa-agua.service';
import { ProgramaAgua } from '../../models/programa-agua.interface';

interface AguaModule {
    label: string;
    icon: string;
    route: string;
    description: string;
}

@Component({
    selector: 'app-programa-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, ConfirmDialogModule, ToastModule, AccordionModule, TooltipModule],
    templateUrl: './programa-agua-list.component.html',
    styleUrls: ['./programa-agua-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class ProgramaAguaListComponent implements OnInit {
    private service = inject(ProgramaAguaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    programasAgua = signal<ProgramaAgua[]>([]);
    loading = signal(false);

    modules: AguaModule[] = [
        { label: 'Fuentes de Agua', icon: 'pi pi-map-marker', route: '/programa-agua/fuente-agua', description: 'Gestionar fuentes de abastecimiento' },
        { label: 'Tanques', icon: 'pi pi-box', route: '/programa-agua/tanque-almacenamiento', description: 'Tanques de almacenamiento' },
        { label: 'Control Potabilidad', icon: 'pi pi-chart-line', route: '/programa-agua/control-potabilidad', description: 'Control diario según Res 2115' },
        { label: 'Análisis Lab.', icon: 'pi pi-inbox', route: '/programa-agua/analisis-laboratorio', description: 'Análisis de laboratorio' },
        { label: 'Mantenimiento', icon: 'pi pi-wrench', route: '/programa-agua/mantenimiento-lavado', description: 'Mantenimiento y lavado' },
        { label: 'Insumos Quím.', icon: 'pi pi-filter', route: '/programa-agua/insumo-quimico', description: 'Insumos químicos' },
        { label: 'Reg. Agua', icon: 'pi pi-file-edit', route: '/programa-agua/registro-agua', description: 'Registro de actividades de agua' },
        { label: 'Acc. Correctivas', icon: 'pi pi-exclamation-triangle', route: '/programa-agua/accion-correctiva-agua', description: 'Acciones correctivas' },
    ];

    ngOnInit() { this.cargarDatos(); }

    async cargarDatos() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.service.getAll());
            this.programasAgua.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los programas de agua' });
        } finally {
            this.loading.set(false);
        }
    }

    confirmarEliminar(item: ProgramaAgua) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este programa de agua?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(item.id));
                    this.programasAgua.update(list => list.filter(p => p.id !== item.id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Programa de agua eliminado correctamente' });
                } catch {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el programa de agua' });
                }
            },
        });
    }
}
