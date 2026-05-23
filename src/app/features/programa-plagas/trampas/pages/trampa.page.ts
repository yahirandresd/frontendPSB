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
import { TrampasService } from '../services/trampas.service';
import { Trampa } from '../models/trampa';
import { TrampaComponent } from '../components/trampas.component';

@Component({
    selector: 'app-trampa-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
              TagModule, TooltipModule, ConfirmDialogModule, ToastModule, TrampaComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './trampa-page.component.html'
})
export class TrampaPageComponent implements OnInit {
    private service = inject(TrampasService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    trampas: Trampa[] = [];
    trampaSeleccionada: Trampa | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void { this.cargarTrampas(); }

    cargarTrampas(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.trampas = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar trampas'); }
        });
    }

    abrirFormulario(trampa?: Trampa): void {
        this.trampaSeleccionada = trampa ?? null;
        this.mostrarFormulario = true;
    }

    verDetalle(trampa: Trampa): void {
        this.trampaSeleccionada = trampa;
        this.mostrarDetalle = true;
    }

    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarTrampas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Trampa guardada correctamente' });
    }

    confirmarEliminar(trampa: Trampa): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar la trampa "${trampa.codigo}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(trampa.id));
                    this.cargarTrampas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Trampa eliminada' });
                } catch { this.mostrarError('Error al eliminar la trampa'); }
            }
        });
    }

    getEstadoSeverity(e: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { activa: 'success', inactiva: 'danger', mantenimiento: 'warn' };
        return map[e] ?? 'info';
    }

    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}