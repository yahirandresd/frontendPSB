import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MedicionPasoService } from '../../services/medicion-paso.service';
import { MedicionPasoFormComponent } from '../../components/medicion-paso-form/medicion-paso-form.component';
import { MedicionPaso } from '../../models/medicion-paso.interface';
import { UpdateMedicionPasoDto } from '../../models/update-medicion-paso.dto';

@Component({
    selector: 'app-medicion-paso-edit',
    standalone: true,
    imports: [MedicionPasoFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './medicion-paso-edit.component.html',
    styleUrls: ['./medicion-paso-edit.component.scss']
})
export class MedicionPasoEditComponent implements OnInit {
    private service = inject(MedicionPasoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    medicion = signal<MedicionPaso | undefined>(undefined);
    checklistId = this.route.snapshot.paramMap.get('checklistId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.medicion.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la medición' });
        }
    }

    async onFormSubmit(dto: UpdateMedicionPasoDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la medición' });
        }
    }
}
