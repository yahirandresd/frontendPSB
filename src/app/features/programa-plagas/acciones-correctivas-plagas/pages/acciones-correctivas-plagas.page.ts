import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { AccionesCorrectivasPlagasService } from '../services/acciones-correctivas-plagas.service';
import { AccionCorrectivaPlagas } from '../models/accion-correctiva-plagas';
import { AccionCorrectivaPlagasComponent } from '../components/acciones-correctivas-plagas.component';

@Component({
    selector: 'app-accion-correctiva-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
              TagModule, TooltipModule, ConfirmDialogModule, ToastModule, AccionCorrectivaPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './accion-correctiva-plagas-page.component.html'
})
export class AccionCorrectivaPlagasPageComponent implements OnInit {
    private service = inject(AccionesCorrectivasPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    acciones: AccionCorrectivaPlagas[] = [];
    accionSeleccionada: AccionCorrectivaPlagas | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void { this.cargarAcciones(); }

    cargarAcciones(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.acciones = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar acciones'); }
        });
    }

    abrirFormulario(accion?: AccionCorrectivaPlagas): void {
        this.accionSeleccionada = accion ?? null;
        this.mostrarFormulario = true;
    }

    verDetalle(accion: AccionCorrectivaPlagas): void {
        this.accionSeleccionada = accion;
        this.mostrarDetalle = true;
    }

    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarAcciones();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Acción guardada correctamente' });
    }

    confirmarEliminar(accion: AccionCorrectivaPlagas): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar esta acción?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(accion.id));
                    this.cargarAcciones();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Acción eliminada' });
                } catch { this.mostrarError('Error al eliminar la acción'); }
            }
        });
    }

    getPrioridadSeverity(p: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { baja: 'success', media: 'info', alta: 'warn', inmediata: 'danger' };
        return map[p] ?? 'info';
    }

    getEstadoSeverity(e: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { pendiente: 'warn', en_ejecucion: 'info', cerrada: 'success' };
        return map[e] ?? 'info';
    }

    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}