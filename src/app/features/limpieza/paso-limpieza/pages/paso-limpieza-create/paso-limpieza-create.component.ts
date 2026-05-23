import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpiezaFormComponent } from '../../components/paso-limpieza-form/paso-limpieza-form.component';
import { CreatePasoLimpiezaDto } from '../../models/create-paso-limpieza.dto';

@Component({
    selector: 'app-paso-limpieza-create',
    standalone: true,
    imports: [PasoLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './paso-limpieza-create.component.html',
    styleUrls: ['./paso-limpieza-create.component.scss']
})
export class PasoLimpiezaCreateComponent {
    private service = inject(PasoLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    programaId = this.route.snapshot.paramMap.get('programaId')!;

    async onFormSubmit(dto: CreatePasoLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el paso' });
        }
    }
}
