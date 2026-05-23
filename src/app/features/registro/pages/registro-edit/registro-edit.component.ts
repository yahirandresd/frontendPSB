import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RegistroFormComponent } from '../../components/registro-form/registro-form.component';
import { RegistroService } from '../../services/registro.service';
import { Registro } from '../../models/registro.interface';
import { UpdateRegistroDto } from '../../models/update-registro.dto';

@Component({
    selector: 'app-registro-edit',
    standalone: true,
    imports: [RegistroFormComponent, ToastModule],
    templateUrl: './registro-edit.component.html',
    styleUrls: ['./registro-edit.component.scss'],
    providers: [MessageService],
})
export class RegistroEditComponent implements OnInit {
    private service = inject(RegistroService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    registro = signal<Registro | undefined>(undefined);
    saving = signal(false);

    ngOnInit() { this.cargar(); }

    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.registro.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el registro' }); }
    }

    async onSubmit(form: { fecha: string; horaInicio: string; horaFin: string; observaciones: string }) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            const dto: UpdateRegistroDto = { fecha: form.fecha, horaInicio: form.horaInicio || undefined, horaFin: form.horaFin || undefined, observaciones: form.observaciones || undefined };
            await firstValueFrom(this.service.update(id, dto));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Registro actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/registro']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/registro']); }
}
