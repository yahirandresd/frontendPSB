import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { AreaPlagasService } from '../services/area-plagas.service';
import { Area } from '../models/area';
import { AreaPlagasComponent } from '../components/area-plagas.component';
 
@Component({
    selector: 'app-area-plagas-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, AreaPlagasComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './area-plagas.pages.html'
})
export class AreaPlagasPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(AreaPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private router              = inject(Router);
    private cdr: ChangeDetectorRef;
 
    areas: Area[] = [];
    areaSeleccionada: Area | null = null;
    programaPlagasId = '';
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        this.programaPlagasId =
            this.route.snapshot.parent?.paramMap.get('programaId') ?? '';
        this.cargarAreas();
    }
 
    cargarAreas(): void {
        this.cargando = true;
        this.service.listarPorPrograma(this.programaPlagasId).subscribe({
            next: data => { this.areas = [...data]; this.cargando = false; this.cdr.detectChanges(); },
            error: () => { this.cargando = false; this.cdr.detectChanges(); this.mostrarError('Error al cargar áreas'); }
        });
    }
 
    abrirFormulario(area?: Area): void { this.areaSeleccionada = area ?? null; this.mostrarFormulario = true; }
    verDetalle(area: Area): void { this.areaSeleccionada = area; this.mostrarDetalle = true; }
 
    verTrampas(area: Area): void {
        this.router.navigate([
            '/control-plagas', this.programaPlagasId,
            'area-plagas', area.id, 'trampas'
        ]);
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarAreas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Área guardada correctamente' });
    }
 
    confirmarEliminar(area: Area): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar esta área?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(area.id));
                    this.cargarAreas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Área eliminada' });
                } catch { this.mostrarError('Error al eliminar el área'); }
            }
        });
    }
 
    getSeveridadRiesgo(nivel: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
            bajo: 'success', medio: 'warn', alto: 'danger', critico: 'danger'
        };
        return map[nivel] ?? 'info';
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}
 