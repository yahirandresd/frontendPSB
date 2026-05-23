import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VerificacionLimpiezaService } from '../../services/verificacion-limpieza.service';
import { VerificacionLimpiezaFormComponent } from '../../components/verificacion-limpieza-form/verificacion-limpieza-form.component';
import { CreateVerificacionLimpiezaDto } from '../../models/create-verificacion-limpieza.dto';

@Component({
    selector: 'app-verificacion-limpieza-create',
    standalone: true,
    imports: [VerificacionLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './verificacion-limpieza-create.component.html',
    styleUrls: ['./verificacion-limpieza-create.component.scss']
})
export class VerificacionLimpiezaCreateComponent {
    private service = inject(VerificacionLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    registroId = this.route.snapshot.paramMap.get('registroId')!;

    async onFormSubmit(dto: CreateVerificacionLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la verificación' });
        }
    }
}
