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
import { RegistroPlagasService } from '../services/registro-plagas.service';
import { RegistroPlagas } from '../models/registro-plagas';
import { RegistroPlagasComponent } from '../components/registro-plagas.component';
 
@Component({
    selector: 'app-registro-plagas-page',
    standalone: true,
    imports: [
        CommonModule, TableModule, ButtonModule, DialogModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule,
        RegistroPlagasComponent
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './registro-plagas.page.html'
})
export class RegistroPlagasPageComponent implements OnInit {
    private service = inject(RegistroPlagasService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
 
    registros: RegistroPlagas[] = [];
    usuarios: any[] = [];
    registroSeleccionado: RegistroPlagas | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;
 
    ngOnInit(): void {
        this.cargarRegistros();
    }
 
    cargarRegistros(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.registros = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar registros'); }
        });
    }
 
    abrirFormulario(registro?: RegistroPlagas): void {
        this.registroSeleccionado = registro ?? null;
        this.mostrarFormulario = true;
    }
 
    verDetalle(registro: RegistroPlagas): void {
        this.registroSeleccionado = registro;
        this.mostrarDetalle = true;
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarRegistros();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado correctamente' });
    }
 
    confirmarEliminar(registro: RegistroPlagas): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este registro?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(registro.id));
                    this.cargarRegistros();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
                } catch {
                    this.mostrarError('Error al eliminar el registro');
                }
            }
        });
    }
 
    getSeveridadResultado(resultado: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, 'success' | 'warn' | 'danger'> = {
            'APROBADO': 'success', 'CONFORME': 'success',
            'OBSERVACIONES': 'warn', 'PENDIENTE': 'warn',
            'NO_APROBADO': 'danger', 'NO_CONFORME': 'danger'
        };
        return map[resultado] ?? 'info';
    }
 
    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}