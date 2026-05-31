import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpiezaFormComponent } from '../../components/paso-limpieza-form/paso-limpieza-form.component';
import { CreatePasoLimpiezaDto } from '../../models/create-paso-limpieza.dto';

@Component({
    selector: 'app-paso-limpieza-create',
    standalone: true,
    imports: [PasoLimpiezaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './paso-limpieza-create.component.html',
    styleUrls: ['./paso-limpieza-create.component.scss']
})
export class PasoLimpiezaCreateComponent {
    private service = inject(PasoLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private messageService = inject(MessageService);

    programaId = this.route.snapshot.paramMap.get('programaId')!;

    volver(): void { this.location.back(); }

    async onFormSubmit(dto: CreatePasoLimpiezaDto): Promise<void> {
        try {
            const nuevo = await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../', nuevo.id, 'editar'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el paso' });
        }
    }
}
