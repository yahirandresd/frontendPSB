import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { EquipoAreaService } from '../../services/equipo-area.service';
import { EquipoAreaFormComponent } from '../../components/equipo-area-form/equipo-area-form.component';
import { CreateEquipoAreaDto } from '../../models/create-equipo-area.dto';

@Component({
    selector: 'app-equipo-area-create',
    standalone: true,
    imports: [EquipoAreaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './equipo-area-create.component.html',
    styleUrls: ['./equipo-area-create.component.scss']
})
export class EquipoAreaCreateComponent {
    private service = inject(EquipoAreaService);
    private router = inject(Router);
    private location = inject(Location);
    private messageService = inject(MessageService);

    volver(): void { this.location.back(); }

    async onFormSubmit(dto: CreateEquipoAreaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['/limpieza/equipos']);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el equipo/área' });
        }
    }
}
