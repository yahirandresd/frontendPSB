import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpiezaFormComponent } from '../../components/programa-limpieza-form/programa-limpieza-form.component';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';
import { UpdateProgramaLimpiezaDto } from '../../models/update-programa-limpieza.dto';

@Component({
    selector: 'app-programa-limpieza-edit',
    standalone: true,
    imports: [ProgramaLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './programa-limpieza-edit.component.html',
    styleUrls: ['./programa-limpieza-edit.component.scss']
})
export class ProgramaLimpiezaEditComponent implements OnInit {
    private service = inject(ProgramaLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    programa = signal<ProgramaLimpieza | undefined>(undefined);
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.programa.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el programa' });
        }
    }

    async onFormSubmit(dto: UpdateProgramaLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['/limpieza/programas']);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el programa' });
        }
    }
}
