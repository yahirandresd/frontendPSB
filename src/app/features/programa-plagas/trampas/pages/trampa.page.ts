import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import { TrampaFormComponent } from '../components/trampas.component';
 
@Component({
    selector: 'app-trampa-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, TrampaFormComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './trampa.page.html'
})
export class TrampaPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(TrampasService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private cdr: ChangeDetectorRef;
 
    trampas: Trampa[] = [];
    trampaSeleccionada: Trampa | null = null;
    areaPlagaId = '';
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        // areaPlagaId viene de la ruta: /area-plagas/:areaId/trampas
        this.areaPlagaId =
            this.route.snapshot.params['areaId'] ??
            this.route.snapshot.parent?.params['areaId'] ?? '';
        this.cargarTrampas();
    }
 
    cargarTrampas(): void {
        this.cargando = true;
        const obs$ = this.areaPlagaId
            ? this.service.listarPorArea(this.areaPlagaId)
            : this.service.listar();
        obs$.subscribe({
            next: data => { this.trampas = [...data]; this.cargando = false; this.cdr.detectChanges(); },
            error: () => { this.cargando = false; this.cdr.detectChanges(); this.mostrarError('Error al cargar trampas'); }
        });
    }
 
    abrirFormulario(t?: Trampa): void { this.trampaSeleccionada = t ?? null; this.mostrarFormulario = true; }
    verDetalle(t: Trampa): void { this.trampaSeleccionada = t; this.mostrarDetalle = true; }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarTrampas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Trampa guardada correctamente' });
    }
 
    confirmarEliminar(t: Trampa): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar la trampa "${t.codigo}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(t.id));
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