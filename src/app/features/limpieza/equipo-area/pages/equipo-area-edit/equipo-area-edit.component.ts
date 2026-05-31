import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { EquipoAreaService } from '../../services/equipo-area.service';
import { EquipoAreaFormComponent } from '../../components/equipo-area-form/equipo-area-form.component';
import { EquipoArea } from '../../models/equipo-area.interface';
import { UpdateEquipoAreaDto } from '../../models/update-equipo-area.dto';

@Component({
    selector: 'app-equipo-area-edit',
    standalone: true,
    imports: [EquipoAreaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './equipo-area-edit.component.html',
    styleUrls: ['./equipo-area-edit.component.scss']
})
export class EquipoAreaEditComponent implements OnInit {
    private service = inject(EquipoAreaService);
    private router = inject(Router);
    private location = inject(Location);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    equipo = signal<EquipoArea | undefined>(undefined);
    private id = this.route.snapshot.paramMap.get('id')!;

    volver(): void { this.location.back(); }

    async ngOnInit(): Promise<void> {
        try {
            this.equipo.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el equipo/área' });
        }
    }

    async onFormSubmit(dto: UpdateEquipoAreaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['/limpieza/equipos']);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el equipo/área' });
        }
    }
}
