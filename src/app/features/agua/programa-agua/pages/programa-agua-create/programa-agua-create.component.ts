import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { ProgramaAguaFormComponent } from '../../components/programa-agua-form/programa-agua-form.component';
import { ProgramaAguaService } from '../../services/programa-agua.service';
import { CreateProgramaAguaDto } from '../../models/create-programa-agua.dto';

@Component({
    selector: 'app-programa-agua-create',
    standalone: true,
    imports: [ProgramaAguaFormComponent, ToastModule],
    templateUrl: './programa-agua-create.component.html',
    styleUrls: ['./programa-agua-create.component.scss'],
    providers: [MessageService],
})
export class ProgramaAguaCreateComponent implements HasUnsavedChanges {
    @ViewChild(ProgramaAguaFormComponent) form!: ProgramaAguaFormComponent;
    private service = inject(ProgramaAguaService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    async onSubmit(form: { objetivo: string; alcance: string; procedimientoGeneral: string }) {
        this.saving.set(true);
        try {
            const dto: CreateProgramaAguaDto = { programaId: '', ...form };
            await firstValueFrom(this.service.create(dto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Programa de agua creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el programa de agua' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua']); }
}
