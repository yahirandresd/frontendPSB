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
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { DiagnosticoPlagasService } from '../services/diagnostico-plagas.service';
import { DiagnosticoInicial } from '../models/diagnostico-inicial';
import { DiagnosticoPlagasComponent } from '../components/diagnostico.component';
 
@Component({
    selector: 'app-diagnostico-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule,
        ChipModule, DiagnosticoPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './diagnostico-plagas.page.html'
})
export class DiagnosticoPlagasPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(DiagnosticoPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private cdr: ChangeDetectorRef;
 
    diagnosticos: DiagnosticoInicial[] = [];
    diagnosticoSeleccionado: DiagnosticoInicial | null = null;
    programaPlagasId = '';
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        this.programaPlagasId =
            this.route.snapshot.parent?.paramMap.get('programaId') ?? '';
        this.cargarDiagnosticos();
    }
 
    cargarDiagnosticos(): void {
        this.cargando = true;
        this.service.listarPorPrograma(this.programaPlagasId).subscribe({
            next: (data) => {
                this.diagnosticos = [...data];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
                this.mostrarError('Error al cargar diagnósticos');
            }
        });
    }
 
    abrirFormulario(diagnostico?: DiagnosticoInicial): void {
        this.diagnosticoSeleccionado = diagnostico ?? null;
        this.mostrarFormulario = true;
    }
 
    verDetalle(diagnostico: DiagnosticoInicial): void {
        this.diagnosticoSeleccionado = diagnostico;
        this.mostrarDetalle = true;
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarDiagnosticos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnóstico guardado correctamente' });
    }
 
    confirmarEliminar(diagnostico: DiagnosticoInicial): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este diagnóstico?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(diagnostico.id));
                    this.cargarDiagnosticos();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Diagnóstico eliminado' });
                } catch { this.mostrarError('Error al eliminar el diagnóstico'); }
            }
        });
    }
 
    getSeveridadRiesgo(nivel: string): 'success' | 'warn' | 'danger' {
        const map: Record<string, 'success' | 'warn' | 'danger'> = {
            'BAJO': 'success', 'MEDIO': 'warn', 'ALTO': 'danger'
        };
        return map[nivel] ?? 'warn';
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}
 