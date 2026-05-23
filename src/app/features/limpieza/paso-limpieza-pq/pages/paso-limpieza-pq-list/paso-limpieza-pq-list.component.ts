import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasoLimpiezaPqService } from '../../services/paso-limpieza-pq.service';
import { PasoLimpiezaPq } from '../../models/paso-limpieza-pq.interface';

@Component({
    selector: 'app-paso-limpieza-pq-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './paso-limpieza-pq-list.component.html',
    styleUrls: ['./paso-limpieza-pq-list.component.scss']
})
export class PasoLimpiezaPqListComponent implements OnInit {
    private service = inject(PasoLimpiezaPqService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    pasoId = this.route.snapshot.paramMap.get('pasoId')!;
    items = signal<PasoLimpiezaPq[]>([]);

    async ngOnInit(): Promise<void> {
        await this.load();
    }

    private async load(): Promise<void> {
        try {
            this.items.set(await firstValueFrom(this.service.getByPaso(this.pasoId)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos' });
        }
    }

    navigateToCreate(): void {
        this.router.navigate(['crear'], { relativeTo: this.route });
    }

    navigateToEdit(id: string): void {
        this.router.navigate([id, 'editar'], { relativeTo: this.route });
    }

    confirmDelete(id: string): void {
        this.confirmationService.confirm({
            message: '¿Eliminar este producto químico?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            accept: () => this.delete(id)
        });
    }

    private async delete(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            await this.load();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' });
        }
    }
}
