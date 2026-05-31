import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ChecklistLimpiezaService } from '../../services/checklist-limpieza.service';
import { ChecklistLimpieza, EstadoChecklist } from '../../models/checklist-limpieza.interface';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-checklist-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TagModule, SlicePipe],
    providers: [MessageService, ConfirmationService],
    templateUrl: './checklist-limpieza-list.component.html',
    styleUrls: ['./checklist-limpieza-list.component.scss']
})
export class ChecklistLimpiezaListComponent implements OnInit {
    private service = inject(ChecklistLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    registroId = this.route.snapshot.paramMap.get('registroId')!;
    items = signal<ChecklistLimpieza[]>([]);

    async ngOnInit(): Promise<void> {
        await this.load();
    }

    private async load(): Promise<void> {
        try {
            this.items.set(await firstValueFrom(this.service.getByRegistro(this.registroId)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el checklist' });
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
            message: '¿Eliminar este ítem del checklist?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            accept: () => this.delete(id)
        });
    }

    private async delete(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            await this.load();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ítem eliminado' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el ítem' });
        }
    }

    estadoSeverity(estado: EstadoChecklist | undefined): Severity {
        if (!estado) return 'secondary';
        const map: Record<EstadoChecklist, Severity> = {
            APROBADO:   'success',
            RECHAZADO:  'danger',
            OBSERVACION:'warn'
        };
        return map[estado] ?? 'secondary';
    }

    estadoLabel(estado: EstadoChecklist | undefined): string {
        if (!estado) return '—';
        const map: Record<EstadoChecklist, string> = {
            APROBADO:    'Aprobado',
            RECHAZADO:   'Rechazado',
            OBSERVACION: 'Observación'
        };
        return map[estado];
    }
}
