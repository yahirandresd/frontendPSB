import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { AccionCorrectivaAguaFormComponent } from '../../components/accion-correctiva-agua-form/accion-correctiva-agua-form.component';
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';

@Component({
    selector: 'app-accion-correctiva-agua-edit',
    standalone: true,
    imports: [AccionCorrectivaAguaFormComponent, ToastModule],
    templateUrl: './accion-correctiva-agua-edit.component.html',
    styleUrls: ['./accion-correctiva-agua-edit.component.scss'],
    providers: [MessageService],
})
export class AccionCorrectivaAguaEditComponent implements OnInit, HasUnsavedChanges {
    @ViewChild(AccionCorrectivaAguaFormComponent) form!: AccionCorrectivaAguaFormComponent;
    private service = inject(AccionCorrectivaAguaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    accionCorrectivaAgua = signal<AccionCorrectivaAgua | undefined>(undefined);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.accionCorrectivaAgua.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            const actualizado = await firstValueFrom(this.service.update(id, data));
            if (actualizado.fechaLimite && new Date(actualizado.fechaLimite) < new Date() && (actualizado.estado === 'pendiente' || actualizado.estado === 'en_proceso')) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Acción correctiva vencida',
                    detail: `La acción correctiva del ${actualizado.fecha} superó su fecha límite (${actualizado.fechaLimite}) y sigue en estado ${actualizado.estado}.`
                });
                setTimeout(() => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
                    setTimeout(() => this.router.navigate(['/programa-agua/accion-correctiva-agua']), 1000);
                }, 800);
            } else {
                this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
                setTimeout(() => this.router.navigate(['/programa-agua/accion-correctiva-agua']), 1000);
            }
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/accion-correctiva-agua']); }
}