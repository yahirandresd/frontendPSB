import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PlanPsbService } from '../../services/plan-psb.service';
import { PlanPsb, EstadoPlan, NivelRiesgo } from '../../models/plan-psb.interface';

@Component({
    selector: 'app-plan-psb-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './plan-psb-list.component.html',
    styleUrls: ['./plan-psb-list.component.scss'],
    providers: [MessageService],
})
export class PlanPsbListComponent implements OnInit {
    private service = inject(PlanPsbService);
    private messageService = inject(MessageService);

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

    estadoSeverity(estado: EstadoPlan): 'success' | 'secondary' | 'danger' | 'warn' {
        const map: Record<EstadoPlan, 'success' | 'secondary' | 'danger' | 'warn'> = {
            ACTIVO: 'success',
            BORRADOR: 'secondary',
            VENCIDO: 'danger',
            EN_REVISION: 'warn',
        };
        return map[estado];
    }

    riesgoSeverity(nivel: NivelRiesgo): 'danger' | 'warn' | 'success' {
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = {
            ALTO: 'danger',
            MEDIO: 'warn',
            BAJO: 'success',
        };
        return map[nivel];
    }
}
