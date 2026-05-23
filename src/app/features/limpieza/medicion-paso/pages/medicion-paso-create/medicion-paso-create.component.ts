import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MedicionPasoService } from '../../services/medicion-paso.service';
import { MedicionPasoFormComponent } from '../../components/medicion-paso-form/medicion-paso-form.component';
import { CreateMedicionPasoDto } from '../../models/create-medicion-paso.dto';

@Component({
    selector: 'app-medicion-paso-create',
    standalone: true,
    imports: [MedicionPasoFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './medicion-paso-create.component.html',
    styleUrls: ['./medicion-paso-create.component.scss']
})
export class MedicionPasoCreateComponent {
    private service = inject(MedicionPasoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    checklistId = this.route.snapshot.paramMap.get('checklistId')!;

    async onFormSubmit(dto: CreateMedicionPasoDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la medición' });
        }
    }
}
