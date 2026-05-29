import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { ControlPotabilidadFormComponent } from '../../components/control-potabilidad-form/control-potabilidad-form.component';
import { ControlPotabilidadService } from '../../services/control-potabilidad.service';

@Component({
    selector: 'app-control-potabilidad-create',
    standalone: true,
    imports: [ControlPotabilidadFormComponent, ToastModule],
    templateUrl: './control-potabilidad-create.component.html',
    styleUrls: ['./control-potabilidad-create.component.scss'],
    providers: [MessageService],
})
export class ControlPotabilidadCreateComponent implements HasUnsavedChanges {
    @ViewChild(ControlPotabilidadFormComponent) form!: ControlPotabilidadFormComponent;
    private service = inject(ControlPotabilidadService);
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
            setTimeout(() => this.router.navigate(['/programa-agua/control-potabilidad']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/control-potabilidad']); }
}