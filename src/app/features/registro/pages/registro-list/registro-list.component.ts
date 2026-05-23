import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RegistroService } from '../../services/registro.service';
import { Registro, EstadoRegistro } from '../../models/registro.interface';

@Component({
    selector: 'app-registro-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TagModule],
    templateUrl: './registro-list.component.html',
    styleUrls: ['./registro-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class RegistroListComponent implements OnInit {
    private service = inject(RegistroService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    items = signal<Registro[]>([]);
    loading = signal(false);

    ngOnInit() { this.cargar(); }

    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los registros' }); }
        finally { this.loading.set(false); }
    }

    estadoSeverity(estado: EstadoRegistro) {
        const map: Record<EstadoRegistro, 'success' | 'info' | 'warn' | 'danger'> = { completado: 'success', en_proceso: 'info', pendiente: 'warn', rechazado: 'danger' };
        return map[estado];
    }

    async completar(item: Registro) {
        this.confirmationService.confirm({
            message: '¿Marcar este registro como completado?', header: 'Completar registro',
            acceptLabel: 'Sí, completar', rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const updated = await firstValueFrom(this.service.completar(item.id, ''));
                    this.items.update(list => list.map(r => r.id === item.id ? updated : r));
                    this.messageService.add({ severity: 'success', summary: 'Completado', detail: 'Registro completado' });
                } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar el registro' }); }
            },
        });
    }

    async rechazar(item: Registro) {
        this.confirmationService.confirm({
            message: '¿Rechazar este registro?', header: 'Rechazar registro',
            acceptLabel: 'Sí, rechazar', rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const updated = await firstValueFrom(this.service.rechazar(item.id, 'Rechazado por el usuario'));
                    this.items.update(list => list.map(r => r.id === item.id ? updated : r));
                    this.messageService.add({ severity: 'warn', summary: 'Rechazado', detail: 'Registro rechazado' });
                } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo rechazar el registro' }); }
            },
        });
    }
}
