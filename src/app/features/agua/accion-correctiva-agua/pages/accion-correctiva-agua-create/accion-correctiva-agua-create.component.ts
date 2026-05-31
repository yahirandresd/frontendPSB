import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { AccionCorrectivaAguaFormComponent } from '../../components/accion-correctiva-agua-form/accion-correctiva-agua-form.component';
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';

@Component({
    selector: 'app-accion-correctiva-agua-create',
    standalone: true,
    imports: [AccionCorrectivaAguaFormComponent, ToastModule],
    templateUrl: './accion-correctiva-agua-create.component.html',
    styleUrls: ['./accion-correctiva-agua-create.component.scss'],
    providers: [MessageService],
})
export class AccionCorrectivaAguaCreateComponent implements HasUnsavedChanges {
    @ViewChild(AccionCorrectivaAguaFormComponent) form!: AccionCorrectivaAguaFormComponent;
    private service = inject(AccionCorrectivaAguaService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            const creado = await firstValueFrom(this.service.create(data));
            if (creado.fechaLimite && new Date(creado.fechaLimite) < new Date() && (creado.estado === 'pendiente' || creado.estado === 'en_proceso')) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Acción correctiva vencida',
                    detail: `La acción correctiva del ${creado.fecha} superó su fecha límite (${creado.fechaLimite}) y sigue en estado ${creado.estado}.`
                });
                setTimeout(() => {
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                    setTimeout(() => this.router.navigate(['/programa-agua/accion-correctiva-agua']), 1000);
                }, 800);
            } else {
                this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                setTimeout(() => this.router.navigate(['/programa-agua/accion-correctiva-agua']), 1000);
            }
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/accion-correctiva-agua']); }
}