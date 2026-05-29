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
import { PlaguicidaService } from '../services/plaguicida.service';
import { Plaguicida } from '../models/plaguicida';
import { PlaguicidaComponent } from '../components/plaguicidas.component';
 
@Component({
    selector: 'app-plaguicida-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, PlaguicidaComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './plaguicida.page.html'
})
export class PlaguicidaPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(PlaguicidaService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private cdr: ChangeDetectorRef;
 
    plaguicidas: Plaguicida[] = [];
    plaguicidaSeleccionado: Plaguicida | null = null;
    programaPlagasId = '';
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        this.programaPlagasId =
            this.route.snapshot.parent?.paramMap.get('programaId') ?? '';
        this.cargarPlaguicidas();
    }
 
    cargarPlaguicidas(): void {
        this.cargando = true;
        this.service.listarPorPrograma(this.programaPlagasId).subscribe({
            next: (data) => {
                this.plaguicidas = [...data];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
                this.mostrarError('Error al cargar plaguicidas');
            }
        });
    }
 
    abrirFormulario(p?: Plaguicida): void {
        this.plaguicidaSeleccionado = p ?? null;
        this.mostrarFormulario = true;
    }
 
    verDetalle(p: Plaguicida): void {
        this.plaguicidaSeleccionado = p;
        this.mostrarDetalle = true;
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarPlaguicidas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Plaguicida guardado correctamente' });
    }
 
    confirmarEliminar(p: Plaguicida): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar "${p.nombreComercial}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(p.id));
                    this.cargarPlaguicidas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Plaguicida eliminado' });
                } catch { this.mostrarError('Error al eliminar el plaguicida'); }
            }
        });
    }
 
    getCategoriaSeverity(c: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { Ia: 'danger', Ib: 'danger', II: 'warn', III: 'info', U: 'success' };
        return map[c] ?? 'info';
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}
 