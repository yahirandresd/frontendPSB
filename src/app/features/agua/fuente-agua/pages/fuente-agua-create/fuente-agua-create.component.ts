import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { FuenteAguaFormComponent } from '../../components/fuente-agua-form/fuente-agua-form.component';
import { FuenteAguaService } from '../../services/fuente-agua.service';

@Component({
    selector: 'app-fuente-agua-create',
    standalone: true,
    imports: [FuenteAguaFormComponent, ToastModule],
    templateUrl: './fuente-agua-create.component.html',
    styleUrls: ['./fuente-agua-create.component.scss'],
    providers: [MessageService],
})
export class FuenteAguaCreateComponent implements HasUnsavedChanges {
    @ViewChild(FuenteAguaFormComponent) form!: FuenteAguaFormComponent;
    private service = inject(FuenteAguaService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(data));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/fuente-agua']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/fuente-agua']); }
}