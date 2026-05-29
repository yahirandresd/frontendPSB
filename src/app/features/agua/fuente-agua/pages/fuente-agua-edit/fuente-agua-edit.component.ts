import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { FuenteAguaFormComponent } from '../../components/fuente-agua-form/fuente-agua-form.component';
import { FuenteAguaService } from '../../services/fuente-agua.service';
import { FuenteAgua } from '../../models/fuente-agua.interface';

@Component({
    selector: 'app-fuente-agua-edit',
    standalone: true,
    imports: [FuenteAguaFormComponent, ToastModule],
    templateUrl: './fuente-agua-edit.component.html',
    styleUrls: ['./fuente-agua-edit.component.scss'],
    providers: [MessageService],
})
export class FuenteAguaEditComponent implements OnInit, HasUnsavedChanges {
    @ViewChild(FuenteAguaFormComponent) form!: FuenteAguaFormComponent;
    private service = inject(FuenteAguaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    fuenteAgua = signal<FuenteAgua | undefined>(undefined);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.fuenteAgua.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/fuente-agua']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/fuente-agua']); }
}