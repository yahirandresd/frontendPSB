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
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { CronogramaService } from '../services/cronograma.service';
import { Cronograma } from '../models/cronograma';
import { CronogramaComponent } from '../components/cronograma.component';
 
@Component({
    selector: 'app-cronograma-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule,
        CheckboxModule, CronogramaComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './cronograma.pages.html'
})
export class CronogramaPageComponent implements OnInit {
    constructor() { this.cdr = inject(ChangeDetectorRef); }
 
    private service             = inject(CronogramaService);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private route               = inject(ActivatedRoute);
    private cdr: ChangeDetectorRef;
 
    cronogramas: Cronograma[] = [];
    cronogramaSeleccionado: Cronograma | null = null;
    programaPlagasId = '';
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    readonly nombresMes = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
 
    ngOnInit(): void {
        this.programaPlagasId =
            this.route.snapshot.parent?.paramMap.get('programaId') ?? '';
        this.cargarCronogramas();
    }
 
    cargarCronogramas(): void {
        this.cargando = true;
        this.service.listarPorPrograma(this.programaPlagasId).subscribe({
            next: (data) => {
                this.cronogramas = [...data];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
                this.mostrarError('Error al cargar cronogramas');
            }
        });
    }
 
    abrirFormulario(c?: Cronograma): void {
        this.cronogramaSeleccionado = c ?? null;
        this.mostrarFormulario = true;
    }
 
    verDetalle(c: Cronograma): void {
        this.cronogramaSeleccionado = c;
        this.mostrarDetalle = true;
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarCronogramas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cronograma guardado correctamente' });
    }
 
    confirmarEliminar(c: Cronograma): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el cronograma ${c.anioVigencia}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(c.id));
                    this.cargarCronogramas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cronograma eliminado' });
                } catch { this.mostrarError('Error al eliminar el cronograma'); }
            }
        });
    }
 
    getCumplimiento(c: Cronograma): number {
        if (!c.actividades?.length) return 0;
        return Math.round((c.actividades.filter(a => a.ejecutada).length / c.actividades.length) * 100);
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}