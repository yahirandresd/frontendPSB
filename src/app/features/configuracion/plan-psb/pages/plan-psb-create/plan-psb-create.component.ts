import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PlanPsbFormComponent, PlanPsbFormValue } from '../../components/plan-psb-form/plan-psb-form.component';
import { PlanPsbService } from '../../services/plan-psb.service';

@Component({
    selector: 'app-plan-psb-create',
    standalone: true,
    imports: [PlanPsbFormComponent, ToastModule],
    templateUrl: './plan-psb-create.component.html',
    styleUrls: ['./plan-psb-create.component.scss'],
    providers: [MessageService],
})
export class PlanPsbCreateComponent {
    private service = inject(PlanPsbService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    saving = signal(false);

    async onSubmit(form: PlanPsbFormValue) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(form));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Plan de saneamiento creado correctamente' });
            setTimeout(() => this.router.navigate(['/planes']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el plan' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.router.navigate(['/planes']); }
}
