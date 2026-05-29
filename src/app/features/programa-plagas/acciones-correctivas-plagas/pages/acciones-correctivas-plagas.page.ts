import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-accion-correctiva-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule,
        AccionCorrectivaPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './acciones-correctivas-plagas.page.html'
})
export class AccionCorrectivaPlagasPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }

    private service = inject(AccionesCorrectivasPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private cdr: ChangeDetectorRef;

    acciones: AccionCorrectivaPlagas[] = [];
    accionSeleccionada: AccionCorrectivaPlagas | null = null;
    hallazgoPlagaId = '';
    plaguicidas: { label: string; value: string }[] = [];
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void {
        // Lee :hallazgoId de la ruta actual o del padre
        this.hallazgoPlagaId =
            this.route.snapshot.params['hallazgoId'] ??
            this.route.snapshot.parent?.params['hallazgoId'] ?? '';
        console.log('hallazgoPlagaId en page:', this.hallazgoPlagaId); // ← agregar
        console.log('URL actual:', this.route.snapshot.url);
        console.log('params:', this.route.snapshot.params);
        this.cargarPlaguicidas();
        this.cargarAcciones();
    }

    cargarPlaguicidas(): void {
        this.http
            .get<{ id: string; nombreComercial: string }[]>(`${environment.apiUrl}/plaguicida`)
            .subscribe({
                next: data => {
                    this.plaguicidas = data.map(p => ({ label: p.nombreComercial, value: p.id }));
                }
            });
    }

    cargarAcciones(): void {
        this.cargando = true;
        const obs$ = this.hallazgoPlagaId
            ? this.service.listarPorHallazgo(this.hallazgoPlagaId)
            : this.service.listar();
        obs$.subscribe({
            next: data => { this.acciones = [...data]; this.cargando = false; this.cdr.detectChanges(); },
            error: () => { this.cargando = false; this.cdr.detectChanges(); this.mostrarError('Error al cargar acciones'); }
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