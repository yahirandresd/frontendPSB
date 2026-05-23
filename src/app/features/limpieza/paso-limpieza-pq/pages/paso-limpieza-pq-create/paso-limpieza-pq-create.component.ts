import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasoLimpiezaPqService } from '../../services/paso-limpieza-pq.service';
import { PasoLimpiezaPqFormComponent } from '../../components/paso-limpieza-pq-form/paso-limpieza-pq-form.component';
import { CreatePasoLimpiezaPqDto } from '../../models/create-paso-limpieza-pq.dto';

@Component({
    selector: 'app-paso-limpieza-pq-create',
    standalone: true,
    imports: [PasoLimpiezaPqFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './paso-limpieza-pq-create.component.html',
    styleUrls: ['./paso-limpieza-pq-create.component.scss']
})
export class PasoLimpiezaPqCreateComponent {
    private service = inject(PasoLimpiezaPqService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    pasoId = this.route.snapshot.paramMap.get('pasoId')!;

    async onFormSubmit(dto: CreatePasoLimpiezaPqDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el producto' });
        }
    }
}
