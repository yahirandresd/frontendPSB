import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaFormComponent } from '../../components/programa-form/programa-form.component';
import { ProgramaService } from '../../services/programa.service';
import { Programa } from '../../models/programa.interface';
import { UpdateProgramaDto } from '../../models/update-programa.dto';

@Component({
    selector: 'app-programa-edit',
    standalone: true,
    imports: [ProgramaFormComponent, ToastModule],
    templateUrl: './programa-edit.component.html',
    styleUrls: ['./programa-edit.component.scss'],
    providers: [MessageService],
})
export class ProgramaEditComponent implements OnInit {
    private service = inject(ProgramaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    programa = signal<Programa | undefined>(undefined);
    saving = signal(false);

    ngOnInit() { this.cargar(); }

    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try {
            this.programa.set(await firstValueFrom(this.service.getById(id)));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el programa' }); }
    }

    async onSubmit(form: { tipo: any; nombre: string; responsable: string; frecuencia: any; descripcion: string }) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            const dto: UpdateProgramaDto = { tipo: form.tipo, nombre: form.nombre, responsable: form.responsable, frecuencia: form.frecuencia, descripcion: form.descripcion || undefined };
            await firstValueFrom(this.service.update(id, dto));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Programa actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programas']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el programa' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programas']); }
}
