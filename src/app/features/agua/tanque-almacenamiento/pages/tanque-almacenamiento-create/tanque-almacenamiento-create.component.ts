import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TanqueAlmacenamientoFormComponent } from '../../components/tanque-almacenamiento-form/tanque-almacenamiento-form.component';
import { TanqueAlmacenamientoService } from '../../services/tanque-almacenamiento.service';

@Component({
    selector: 'app-tanque-almacenamiento-create',
    standalone: true,
    imports: [TanqueAlmacenamientoFormComponent, ToastModule],
    templateUrl: './tanque-almacenamiento-create.component.html',
    styleUrls: ['./tanque-almacenamiento-create.component.scss'],
    providers: [MessageService],
})
export class TanqueAlmacenamientoCreateComponent {
    private service = inject(TanqueAlmacenamientoService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);
    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(data));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/tanque-almacenamiento']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/tanque-almacenamiento']); }
}