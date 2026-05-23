import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpiezaFormComponent } from '../../components/programa-limpieza-form/programa-limpieza-form.component';
import { CreateProgramaLimpiezaDto } from '../../models/create-programa-limpieza.dto';

@Component({
    selector: 'app-programa-limpieza-create',
    standalone: true,
    imports: [ProgramaLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './programa-limpieza-create.component.html',
    styleUrls: ['./programa-limpieza-create.component.scss']
})
export class ProgramaLimpiezaCreateComponent {
    private service = inject(ProgramaLimpiezaService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    async onFormSubmit(dto: CreateProgramaLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['/limpieza/programas']);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el programa' });
        }
    }
}
