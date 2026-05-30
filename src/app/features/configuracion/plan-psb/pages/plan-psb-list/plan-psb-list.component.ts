import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PlanPsbService } from '../../services/plan-psb.service';
import { UpperCasePipe } from '@angular/common';
import { PlanPsb } from '../../models/plan-psb.interface';

@Component({
    selector: 'app-plan-psb-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, TooltipModule, UpperCasePipe],
    templateUrl: './plan-psb-list.component.html',
    styleUrls: ['./plan-psb-list.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PlanPsbListComponent implements OnInit {
    private service = inject(PlanPsbService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    planes = signal<PlanPsb[]>([]);
    loading = signal(false);

    ngOnInit() { this.cargarPlanes(); }

    async cargarPlanes() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.service.getAll());
            this.planes.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los planes' });
        } finally {
            this.loading.set(false);
        }
    }

    confirmarEliminar(plan: PlanPsb) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el plan "<strong>${plan.nombre}</strong>"? Esta acción no se puede deshacer.`,
            header: 'Eliminar plan',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(plan.id),
        });
    }

    async eliminar(id: string) {
        try {
            await firstValueFrom(this.service.delete(id));
            this.planes.update(lista => lista.filter(p => p.id !== id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Plan eliminado correctamente' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el plan' });
        }
    }

    estadoSeverity(estado: string): 'success' | 'secondary' | 'danger' | 'warn' {
        const map: Record<string, 'success' | 'secondary' | 'danger' | 'warn'> = {
            ACTIVO: 'success', VIGENTE: 'success',
            BORRADOR: 'secondary',
            VENCIDO: 'danger',
            EN_REVISION: 'warn',
        };
        return map[estado.toUpperCase()] ?? 'secondary';
    }

    riesgoSeverity(nivel: string): 'danger' | 'warn' | 'success' {
        const map: Record<string, 'danger' | 'warn' | 'success'> = {
            ALTO: 'danger',
            MEDIO: 'warn',
            BAJO: 'success',
        };
        return map[nivel.toUpperCase()] ?? 'warn';
    }
}
