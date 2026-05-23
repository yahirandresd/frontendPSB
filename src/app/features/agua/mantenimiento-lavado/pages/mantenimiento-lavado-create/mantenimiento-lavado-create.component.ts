import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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
export class MantenimientoLavadoCreateComponent {
    private service = inject(MantenimientoLavadoService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);
    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(data));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/mantenimiento-lavado']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/mantenimiento-lavado']); }
}