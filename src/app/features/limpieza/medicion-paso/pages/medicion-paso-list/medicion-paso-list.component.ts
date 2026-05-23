import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MedicionPasoService } from '../../services/medicion-paso.service';
import { MedicionPaso } from '../../models/medicion-paso.interface';

@Component({
    selector: 'app-medicion-paso-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TagModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './medicion-paso-list.component.html',
    styleUrls: ['./medicion-paso-list.component.scss']
})
export class MedicionPasoListComponent implements OnInit {
    private service = inject(MedicionPasoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    checklistId = this.route.snapshot.paramMap.get('checklistId')!;
    items = signal<MedicionPaso[]>([]);

    async ngOnInit(): Promise<void> {
        await this.load();
    }

    private async load(): Promise<void> {
        try {
            this.items.set(await firstValueFrom(this.service.getByChecklist(this.checklistId)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las mediciones' });
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
            message: '¿Eliminar esta medición?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            accept: () => this.delete(id)
        });
    }

    private async delete(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            await this.load();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Medición eliminada' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la medición' });
        }
    }
}
