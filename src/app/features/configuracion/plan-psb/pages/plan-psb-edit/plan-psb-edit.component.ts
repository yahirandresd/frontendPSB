import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PlanPsbFormComponent, PlanPsbFormValue } from '../../components/plan-psb-form/plan-psb-form.component';
import { PlanPsbService } from '../../services/plan-psb.service';
import { PlanPsb } from '../../models/plan-psb.interface';

@Component({
    selector: 'app-plan-psb-edit',
    standalone: true,
    imports: [PlanPsbFormComponent, ToastModule],
    templateUrl: './plan-psb-edit.component.html',
    styleUrls: ['./plan-psb-edit.component.scss'],
    providers: [MessageService],
})
export class PlanPsbEditComponent implements OnInit {
    private service = inject(PlanPsbService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    plan = signal<PlanPsb | undefined>(undefined);
    saving = signal(false);

    ngOnInit() { this.cargarPlan(); }

    async cargarPlan() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try {
            const data = await firstValueFrom(this.service.getById(id));
            this.plan.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el plan' });
        }
    }

    async onSubmit(form: PlanPsbFormValue) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, form));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Plan actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/planes']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el plan' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.router.navigate(['/planes']); }
}
