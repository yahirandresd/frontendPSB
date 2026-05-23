import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaAguaFormComponent } from '../../components/programa-agua-form/programa-agua-form.component';
import { ProgramaAguaService } from '../../services/programa-agua.service';
import { ProgramaAgua } from '../../models/programa-agua.interface';
import { UpdateProgramaAguaDto } from '../../models/update-programa-agua.dto';

@Component({
    selector: 'app-programa-agua-edit',
    standalone: true,
    imports: [ProgramaAguaFormComponent, ToastModule],
    templateUrl: './programa-agua-edit.component.html',
    styleUrls: ['./programa-agua-edit.component.scss'],
    providers: [MessageService],
})
export class ProgramaAguaEditComponent implements OnInit {
    private service = inject(ProgramaAguaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    programaAgua = signal<ProgramaAgua | undefined>(undefined);
    saving = signal(false);

    ngOnInit() { this.cargarPrograma(); }

    async cargarPrograma() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try {
            const data = await firstValueFrom(this.service.getById(id));
            this.programaAgua.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el programa de agua' });
        }
    }

    async onSubmit(form: { objetivo: string; alcance: string; procedimientoGeneral: string }) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            const dto: UpdateProgramaAguaDto = form;
            await firstValueFrom(this.service.update(id, dto));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Programa de agua actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el programa de agua' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.router.navigate(['/programa-agua']); }
}
