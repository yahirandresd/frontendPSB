import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { TanqueAlmacenamientoFormComponent } from '../../components/tanque-almacenamiento-form/tanque-almacenamiento-form.component';
import { TanqueAlmacenamientoService } from '../../services/tanque-almacenamiento.service';
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';

@Component({
    selector: 'app-tanque-almacenamiento-edit',
    standalone: true,
    imports: [TanqueAlmacenamientoFormComponent, ToastModule],
    templateUrl: './tanque-almacenamiento-edit.component.html',
    styleUrls: ['./tanque-almacenamiento-edit.component.scss'],
    providers: [MessageService],
})
export class TanqueAlmacenamientoEditComponent implements OnInit, HasUnsavedChanges {
    @ViewChild(TanqueAlmacenamientoFormComponent) form!: TanqueAlmacenamientoFormComponent;
    private service = inject(TanqueAlmacenamientoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    tanqueAlmacenamiento = signal<TanqueAlmacenamiento | undefined>(undefined);
    saving = signal(false);

    hasUnsavedChanges(): boolean { return this.form.hasUnsavedChanges(); }
    markAsPristine(): void { this.form.markAsPristine(); }

    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.tanqueAlmacenamiento.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/tanque-almacenamiento']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.markAsPristine(); this.router.navigate(['/programa-agua/tanque-almacenamiento']); }
}