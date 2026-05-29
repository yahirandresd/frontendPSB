import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
import { HallazgoService } from '../services/hallazgo.service';
import { Hallazgo } from '../models/hallazgo';
import { HallazgoPlagasComponent } from '../components/hallazgos.component';
import { environment } from '@/environments/environment';
 
@Component({
    selector: 'app-hallazgo-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, HallazgoPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './hallazgo.page.html'
})
export class HallazgoPlagasPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(HallazgoService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private router              = inject(Router);
    private http                = inject(HttpClient);
    private cdr: ChangeDetectorRef;
 
    hallazgos: Hallazgo[] = [];
    hallazgoSeleccionado: Hallazgo | null = null;
    registroPlagaId = '';
    programaPlagasId = '';
    tiposPlaga: { label: string; value: string }[] = [];
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        this.registroPlagaId =
            this.route.snapshot.params['registroId'] ??
            this.route.snapshot.parent?.params['registroId'] ?? '';
        this.programaPlagasId =
            this.route.snapshot.parent?.paramMap.get('programaId') ??
            this.route.snapshot.parent?.parent?.paramMap.get('programaId') ?? '';
        this.cargarTiposPlagas();
        this.cargarHallazgos();
    }
 
    cargarTiposPlagas(): void {
        this.http.get<{ id: string; nombre: string }[]>(`${environment.apiUrl}/tipo-plaga`)
            .subscribe({ next: data => { this.tiposPlaga = data.map(t => ({ label: t.nombre, value: t.id })); } });
    }
 
    cargarHallazgos(): void {
        this.cargando = true;
        const obs$ = this.registroPlagaId
            ? this.service.listarPorRegistro(this.registroPlagaId)
            : this.service.listar();
        obs$.subscribe({
            next: data => { this.hallazgos = [...data]; this.cargando = false; this.cdr.detectChanges(); },
            error: () => { this.cargando = false; this.cdr.detectChanges(); this.mostrarError('Error al cargar hallazgos'); }
        });
    }
 
    abrirFormulario(h?: Hallazgo): void { this.hallazgoSeleccionado = h ?? null; this.mostrarFormulario = true; }
    verDetalle(h: Hallazgo): void { this.hallazgoSeleccionado = h; this.mostrarDetalle = true; }
 
    verAcciones(h: Hallazgo): void {
        this.router.navigate([
            '/control-plagas', this.programaPlagasId,
            'registro-plagas', this.registroPlagaId,
            'hallazgos', h.id, 'acciones'
        ]);
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarHallazgos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hallazgo guardado correctamente' });
    }
 
    confirmarEliminar(h: Hallazgo): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este hallazgo?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(h.id));
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