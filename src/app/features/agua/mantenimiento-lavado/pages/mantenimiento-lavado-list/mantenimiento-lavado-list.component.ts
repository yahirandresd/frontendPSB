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
import { MantenimientoLavadoService } from '../../services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../models/mantenimiento-lavado.interface';
import { FuenteAguaService } from '../../../fuente-agua/services/fuente-agua.service';

@Component({
    selector: 'app-mantenimiento-lavado-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
    templateUrl: './mantenimiento-lavado-list.component.html',
    styleUrls: ['./mantenimiento-lavado-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class MantenimientoLavadoListComponent implements OnInit {
    private service = inject(MantenimientoLavadoService);
    private fuenteAguaService = inject(FuenteAguaService);
    private messageService = inject(MessageService);
    items = signal<MantenimientoLavado[]>([]);
    fuenteMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    private confirmationService = inject(ConfirmationService);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, fuentes] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.fuenteAguaService.getAll()),
            ]);
            this.items.set(data);
            this.fuenteMap.set(new Map(fuentes.map(f => [f.id, f.nombre])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
    confirmarEliminar(item: MantenimientoLavado) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este mantenimiento y lavado?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(item.id));
                    this.items.update(list => list.filter(i => i.id !== item.id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Mantenimiento eliminado correctamente' });
                } catch {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el mantenimiento' });
                }
            },
        });
    }
}
