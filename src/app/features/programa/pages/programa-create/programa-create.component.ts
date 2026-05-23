import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaFormComponent } from '../../components/programa-form/programa-form.component';
import { ProgramaService } from '../../services/programa.service';
import { CreateProgramaDto } from '../../models/create-programa.dto';

@Component({
    selector: 'app-programa-create',
    standalone: true,
    imports: [ProgramaFormComponent, ToastModule],
    templateUrl: './programa-create.component.html',
    styleUrls: ['./programa-create.component.scss'],
    providers: [MessageService],
})
export class ProgramaCreateComponent {
    private service = inject(ProgramaService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);

    async onSubmit(form: { tipo: any; nombre: string; responsable: string; frecuencia: any; descripcion: string }) {
        this.saving.set(true);
        try {
            const dto: CreateProgramaDto = { planPsbId: '', tipo: form.tipo, nombre: form.nombre, responsable: form.responsable, frecuencia: form.frecuencia, descripcion: form.descripcion || undefined };
            await firstValueFrom(this.service.create(dto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Programa creado correctamente' });
            setTimeout(() => this.router.navigate(['/programas']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el programa' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programas']); }
}
