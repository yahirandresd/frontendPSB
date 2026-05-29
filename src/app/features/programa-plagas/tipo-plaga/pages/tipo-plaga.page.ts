import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { TipoPlagaService } from '../services/tipo-plaga.service';
import { TipoPlaga } from '../models/tipo-plaga';
import { TipoPlagaComponent } from '../components/tipo-plaga.component';
 
@Component({
    selector: 'app-tipo-plaga-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, TipoPlagaComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './tipo-plaga.page.html'
})
export class TipoPlagaPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(TipoPlagaService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private cdr: ChangeDetectorRef;
 
    tipos: TipoPlaga[] = [];
    tipoSeleccionado: TipoPlaga | null = null;
    cargando = false;
    mostrarFormulario = false;
 
    ngOnInit(): void { this.cargarTipos(); }
 
    cargarTipos(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => {
                this.tipos = [...data];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
                this.mostrarError('Error al cargar tipos de plaga');
            }
        });
    }
 
    abrirFormulario(tipo?: TipoPlaga): void {
        this.tipoSeleccionado = tipo ?? null;
        this.mostrarFormulario = true;
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarTipos();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de plaga guardado' });
    }
 
    confirmarEliminar(tipo: TipoPlaga): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar "${tipo.nombre}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(tipo.id));
                    this.cargarTipos();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Tipo eliminado' });
                } catch { this.mostrarError('Error al eliminar el tipo'); }
            }
        });
    }
 
    getRiesgoSeverity(r: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, any> = { BAJO: 'success', MEDIO: 'warn', ALTO: 'danger', 'MUY ALTO': 'danger' };
        return map[r] ?? 'info';
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}