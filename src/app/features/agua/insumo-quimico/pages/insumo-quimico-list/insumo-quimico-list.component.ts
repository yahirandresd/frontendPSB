import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';
import { InsumoQuimico } from '../../models/insumo-quimico.interface';
import { MantenimientoLavadoService } from '../../../mantenimiento-lavado/services/mantenimiento-lavado.service';

@Component({
    selector: 'app-insumo-quimico-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
    templateUrl: './insumo-quimico-list.component.html',
    styleUrls: ['./insumo-quimico-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class InsumoQuimicoListComponent implements OnInit {
    private service = inject(InsumoQuimicoService);
    private mantenimientoService = inject(MantenimientoLavadoService);
    private messageService = inject(MessageService);
    items = signal<InsumoQuimico[]>([]);
    mantenimientoMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    private confirmationService = inject(ConfirmationService);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, mantenimientos] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.mantenimientoService.getAll()),
            ]);
            this.items.set(data);
            this.mantenimientoMap.set(new Map(mantenimientos.map(m => [m.id, m.metodoLimpieza])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
    confirmarEliminar(item: InsumoQuimico) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este insumo químico?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(item.id));
                    this.items.update(list => list.filter(i => i.id !== item.id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Insumo químico eliminado correctamente' });
                } catch {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el insumo químico' });
                }
            },
        });
    }
}
