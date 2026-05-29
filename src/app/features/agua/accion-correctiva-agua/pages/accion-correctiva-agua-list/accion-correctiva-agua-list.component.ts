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
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';
import { RegistroAguaService } from '../../../registro-agua/services/registro-agua.service';

@Component({
    selector: 'app-accion-correctiva-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
    templateUrl: './accion-correctiva-agua-list.component.html',
    styleUrls: ['./accion-correctiva-agua-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class AccionCorrectivaAguaListComponent implements OnInit {
    private service = inject(AccionCorrectivaAguaService);
    private registroAguaService = inject(RegistroAguaService);
    private messageService = inject(MessageService);
    items = signal<AccionCorrectivaAgua[]>([]);
    registroMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    private confirmationService = inject(ConfirmationService);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, registros] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.registroAguaService.getAll()),
            ]);
            this.items.set(data);
            this.registroMap.set(new Map(registros.map(r => [r.id, r.tipoActividad])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
    confirmarEliminar(item: AccionCorrectivaAgua) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar esta acción correctiva?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(item.id));
                    this.items.update(list => list.filter(i => i.id !== item.id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Acción correctiva eliminada correctamente' });
                } catch {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la acción correctiva' });
                }
            },
        });
    }
}
