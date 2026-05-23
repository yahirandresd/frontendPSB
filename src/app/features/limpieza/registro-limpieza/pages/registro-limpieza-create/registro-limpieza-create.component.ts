import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RegistroLimpiezaService } from '../../services/registro-limpieza.service';
import { RegistroLimpiezaFormComponent } from '../../components/registro-limpieza-form/registro-limpieza-form.component';
import { CreateRegistroLimpiezaDto } from '../../models/create-registro-limpieza.dto';

@Component({
    selector: 'app-registro-limpieza-create',
    standalone: true,
    imports: [RegistroLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './registro-limpieza-create.component.html',
    styleUrls: ['./registro-limpieza-create.component.scss']
})
export class RegistroLimpiezaCreateComponent {
    private service = inject(RegistroLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    programaId = this.route.snapshot.paramMap.get('programaId')!;

    async onFormSubmit(dto: CreateRegistroLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el registro' });
        }
    }
}
