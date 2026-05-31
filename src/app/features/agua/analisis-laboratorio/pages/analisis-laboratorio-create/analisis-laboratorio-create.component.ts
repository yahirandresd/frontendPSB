import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { AnalisisLaboratorioFormComponent } from '../../components/analisis-laboratorio-form/analisis-laboratorio-form.component';
import { AnalisisLaboratorioService } from '../../services/analisis-laboratorio.service';

@Component({
    selector: 'app-analisis-laboratorio-create',
    standalone: true,
    imports: [AnalisisLaboratorioFormComponent, ToastModule],
    templateUrl: './analisis-laboratorio-create.component.html',
    styleUrls: ['./analisis-laboratorio-create.component.scss'],
    providers: [MessageService],
})
export class AnalisisLaboratorioCreateComponent implements HasUnsavedChanges {
    @ViewChild(AnalisisLaboratorioFormComponent) form!: AnalisisLaboratorioFormComponent;
    private service = inject(AnalisisLaboratorioService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            const creado = await firstValueFrom(this.service.create(data));
            if (!creado.cumpleNormaGeneral) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Análisis de laboratorio no conforme',
                    detail: `IRCA: ${creado.irca}% · Nivel de riesgo: ${creado.nivelRiesgo}. Se requiere acción correctiva.`
                });
                setTimeout(() => {
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                    setTimeout(() => this.router.navigate(['/programa-agua/analisis-laboratorio']), 1000);
                }, 800);
            } else {
                this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                setTimeout(() => this.router.navigate(['/programa-agua/analisis-laboratorio']), 1000);
            }
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/analisis-laboratorio']); }
}