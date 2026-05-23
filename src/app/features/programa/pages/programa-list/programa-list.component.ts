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
import { ProgramaService } from '../../services/programa.service';
import { Programa, TipoPrograma } from '../../models/programa.interface';

@Component({
    selector: 'app-programa-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TagModule],
    templateUrl: './programa-list.component.html',
    styleUrls: ['./programa-list.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class ProgramaListComponent implements OnInit {
    private service = inject(ProgramaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    items = signal<Programa[]>([]);
    loading = signal(false);

    ngOnInit() { this.cargar(); }

    async cargar() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.service.getAll());
            this.items.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los programas' });
        } finally { this.loading.set(false); }
    }

    tagSeverity(tipo: TipoPrograma) {
        const map: Record<TipoPrograma, 'info' | 'success' | 'warn' | 'secondary'> = { agua: 'info', limpieza: 'success', plagas: 'warn', residuos: 'secondary' };
        return map[tipo];
    }

    confirmarEliminar(item: Programa) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este programa?',
            header: 'Confirmar eliminación', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(item.id));
                    this.items.update(list => list.filter(p => p.id !== item.id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Programa eliminado correctamente' });
                } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el programa' }); }
            },
        });
    }
}
