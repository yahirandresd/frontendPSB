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
import { EvidenciaPlagasService } from '../services/evidencia-plagas.service';
import { Evidencia } from '../models/evidencia';
import { EvidenciaPlagasComponent } from '../components/evidencia-plagas.component';

@Component({
    selector: 'app-evidencia-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
              TagModule, TooltipModule, ConfirmDialogModule, ToastModule, EvidenciaPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './evidencia-plagas-page.component.html'
})
export class EvidenciaPlagasPageComponent implements OnInit {
    private service = inject(EvidenciaPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    evidencias: Evidencia[] = [];
    evidenciaSeleccionada: Evidencia | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void { this.cargarEvidencias(); }

    cargarEvidencias(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.evidencias = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar evidencias'); }
        });
    }

    abrirFormulario(evidencia?: Evidencia): void {
        this.evidenciaSeleccionada = evidencia ?? null;
        this.mostrarFormulario = true;
    }

    verDetalle(evidencia: Evidencia): void {
        this.evidenciaSeleccionada = evidencia;
        this.mostrarDetalle = true;
    }

    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarEvidencias();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evidencia guardada correctamente' });
    }

    confirmarEliminar(evidencia: Evidencia): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar esta evidencia?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(evidencia.id));
                    this.cargarEvidencias();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Evidencia eliminada' });
                } catch { this.mostrarError('Error al eliminar la evidencia'); }
            }
        });
    }

    getTipoIcon(tipo: string): string {
        const map: Record<string, string> = { imagen: 'pi-image', pdf: 'pi-file-pdf', video: 'pi-video' };
        return map[tipo] ?? 'pi-file';
    }

    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}