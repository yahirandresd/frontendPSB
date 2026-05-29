import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { InsumoQuimicoFormComponent } from '../../components/insumo-quimico-form/insumo-quimico-form.component';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';
import { InsumoQuimico } from '../../models/insumo-quimico.interface';

@Component({
    selector: 'app-insumo-quimico-edit',
    standalone: true,
    imports: [InsumoQuimicoFormComponent, ToastModule],
    templateUrl: './insumo-quimico-edit.component.html',
    styleUrls: ['./insumo-quimico-edit.component.scss'],
    providers: [MessageService],
})
export class InsumoQuimicoEditComponent implements OnInit, HasUnsavedChanges {
    @ViewChild(InsumoQuimicoFormComponent) form!: InsumoQuimicoFormComponent;
    private service = inject(InsumoQuimicoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    insumoQuimico = signal<InsumoQuimico | undefined>(undefined);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.insumoQuimico.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/insumo-quimico']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/insumo-quimico']); }
}