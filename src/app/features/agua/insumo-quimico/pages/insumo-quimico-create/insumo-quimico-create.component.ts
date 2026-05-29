import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { InsumoQuimicoFormComponent } from '../../components/insumo-quimico-form/insumo-quimico-form.component';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';

@Component({
    selector: 'app-insumo-quimico-create',
    standalone: true,
    imports: [InsumoQuimicoFormComponent, ToastModule],
    templateUrl: './insumo-quimico-create.component.html',
    styleUrls: ['./insumo-quimico-create.component.scss'],
    providers: [MessageService],
})
export class InsumoQuimicoCreateComponent implements HasUnsavedChanges {
    @ViewChild(InsumoQuimicoFormComponent) form!: InsumoQuimicoFormComponent;
    private service = inject(InsumoQuimicoService);
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
            setTimeout(() => this.router.navigate(['/programa-agua/insumo-quimico']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/insumo-quimico']); }
}