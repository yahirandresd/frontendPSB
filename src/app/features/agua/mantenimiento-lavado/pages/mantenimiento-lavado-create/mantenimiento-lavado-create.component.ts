import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { MantenimientoLavadoFormComponent } from '../../components/mantenimiento-lavado-form/mantenimiento-lavado-form.component';
import { MantenimientoLavadoService } from '../../services/mantenimiento-lavado.service';

@Component({
    selector: 'app-mantenimiento-lavado-create',
    standalone: true,
    imports: [MantenimientoLavadoFormComponent, ToastModule],
    templateUrl: './mantenimiento-lavado-create.component.html',
    styleUrls: ['./mantenimiento-lavado-create.component.scss'],
    providers: [MessageService],
})
export class MantenimientoLavadoCreateComponent implements HasUnsavedChanges {
    @ViewChild(MantenimientoLavadoFormComponent) form!: MantenimientoLavadoFormComponent;
    private service = inject(MantenimientoLavadoService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            const creado = await firstValueFrom(this.service.create(data));
            if (creado.estado === 'programado' && new Date(creado.fechaProgramada) < new Date()) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Mantenimiento no ejecutado',
                    detail: `El mantenimiento programado para ${creado.fechaProgramada} no ha sido ejecutado.`
                });
                setTimeout(() => {
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                    setTimeout(() => this.router.navigate(['/programa-agua/mantenimiento-lavado']), 1000);
                }, 800);
            } else {
                this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
                setTimeout(() => this.router.navigate(['/programa-agua/mantenimiento-lavado']), 1000);
            }
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/mantenimiento-lavado']); }
}