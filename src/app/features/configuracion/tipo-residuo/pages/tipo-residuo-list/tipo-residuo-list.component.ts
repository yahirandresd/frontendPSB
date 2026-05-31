import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { TipoResiduoService } from '../../services/tipo-residuo.service';
import { TipoResiduo } from '../../models/tipo-residuo.interface';

@Component({
    selector: 'app-tipo-residuo-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TableModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule,
        ToolbarModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './tipo-residuo-list.component.html',
    styleUrls: ['./tipo-residuo-list.component.scss']
})
export class TipoResiduoListComponent implements OnInit {
    private service = inject(TipoResiduoService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    tipos = signal<TipoResiduo[]>([]);
    loading = signal(false);

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.service.getAll());
            this.tipos.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de residuo.' });
        } finally {
            this.loading.set(false);
        }
    }

    onGlobalFilter(event: Event, dt: any): void {
        dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editar(id: string): void {
        this.router.navigate(['/catalogos/tipos-residuo', id, 'editar']);
    }

    eliminar(id: string, nombre: string): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el tipo de residuo <strong>${nombre}</strong>?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.delete(id));
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `"${nombre}" eliminado correctamente.` });
                    await this.cargar();
                } catch {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el tipo de residuo.' });
                }
            }
        });
    }

    severityPeligroso(es_peligroso: boolean): 'danger' | 'success' {
        return es_peligroso ? 'danger' : 'success';
    }
}
