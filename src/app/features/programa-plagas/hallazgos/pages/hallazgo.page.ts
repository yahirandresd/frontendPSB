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
import { HallazgoService } from '../services/hallazgo.service';
import { Hallazgo } from '../models/hallazgo';
import { HallazgoPlagasComponent } from '../components/hallazgos.component';

@Component({
    selector: 'app-hallazgo-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
              TagModule, TooltipModule, ConfirmDialogModule, ToastModule, HallazgoPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './hallazgo-plagas-page.component.html'
})
export class HallazgoPlagasPageComponent implements OnInit {
    private service = inject(HallazgoService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    hallazgos: Hallazgo[] = [];
    hallazgoSeleccionado: Hallazgo | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void { this.cargarHallazgos(); }

    cargarHallazgos(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.hallazgos = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar hallazgos'); }
        });
    }

    abrirFormulario(hallazgo?: Hallazgo): void {
        this.hallazgoSeleccionado = hallazgo ?? null;
        this.mostrarFormulario = true;
    }

    verDetalle(hallazgo: Hallazgo): void {
        this.hallazgoSeleccionado = hallazgo;
        this.mostrarDetalle = true;
    }

    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarHallazgos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hallazgo guardado correctamente' });
    }

    confirmarEliminar(hallazgo: Hallazgo): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este hallazgo?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(hallazgo.id));
                    this.cargarHallazgos();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Hallazgo eliminado' });
                } catch { this.mostrarError('Error al eliminar el hallazgo'); }
            }
        });
    }

    getSeveridad(s: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { leve: 'info', moderado: 'warn', grave: 'danger', critico: 'danger' };
        return map[s] ?? 'info';
    }

    getEstado(e: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { abierto: 'danger', en_gestion: 'warn', cerrado: 'success' };
        return map[e] ?? 'info';
    }

    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}