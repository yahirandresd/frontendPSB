import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmpresaFormComponent, EmpresaFormValue } from '../../components/empresa-form/empresa-form.component';
import { EmpresaService } from '../../services/empresa.service';

@Component({
    selector: 'app-empresa-create',
    standalone: true,
    imports: [EmpresaFormComponent, ToastModule],
    templateUrl: './empresa-create.component.html',
    styleUrls: ['./empresa-create.component.scss'],
    providers: [MessageService],
})
export class EmpresaCreateComponent {
    private service = inject(EmpresaService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    saving = signal(false);

    async onSubmit(form: EmpresaFormValue) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(form));
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Empresa registrada correctamente' });
            setTimeout(() => this.router.navigate(['/configuracion-inicial']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la empresa' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.router.navigate(['/configuracion-inicial']); }
}
