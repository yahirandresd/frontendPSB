import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RegistroAguaFormComponent } from '../../components/registro-agua-form/registro-agua-form.component';
import { RegistroAguaService } from '../../services/registro-agua.service';

@Component({
    selector: 'app-registro-agua-create',
    standalone: true,
    imports: [RegistroAguaFormComponent, ToastModule],
    templateUrl: './registro-agua-create.component.html',
    styleUrls: ['./registro-agua-create.component.scss'],
    providers: [MessageService],
})
export class RegistroAguaCreateComponent {
    private service = inject(RegistroAguaService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);
    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(data));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/registro-agua']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/registro-agua']); }
}