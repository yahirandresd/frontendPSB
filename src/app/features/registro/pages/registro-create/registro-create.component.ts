import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RegistroFormComponent } from '../../components/registro-form/registro-form.component';
import { RegistroService } from '../../services/registro.service';
import { CreateRegistroDto } from '../../models/create-registro.dto';

@Component({
    selector: 'app-registro-create',
    standalone: true,
    imports: [RegistroFormComponent, ToastModule],
    templateUrl: './registro-create.component.html',
    styleUrls: ['./registro-create.component.scss'],
    providers: [MessageService],
})
export class RegistroCreateComponent {
    private service = inject(RegistroService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    async onSubmit(form: { fecha: string; horaInicio: string; horaFin: string; observaciones: string }) {
        this.saving.set(true);
        try {
            const dto: CreateRegistroDto = { programaId: '', usuarioId: '', fecha: form.fecha, horaInicio: form.horaInicio || undefined, horaFin: form.horaFin || undefined, observaciones: form.observaciones || undefined };
            await firstValueFrom(this.service.create(dto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Registro creado correctamente' });
            setTimeout(() => this.router.navigate(['/registro']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el registro' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/registro']); }
}
