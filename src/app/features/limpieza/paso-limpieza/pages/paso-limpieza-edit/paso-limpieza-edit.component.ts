import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpiezaFormComponent } from '../../components/paso-limpieza-form/paso-limpieza-form.component';
import { PasoLimpieza } from '../../models/paso-limpieza.interface';
import { UpdatePasoLimpiezaDto } from '../../models/update-paso-limpieza.dto';

@Component({
    selector: 'app-paso-limpieza-edit',
    standalone: true,
    imports: [PasoLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './paso-limpieza-edit.component.html',
    styleUrls: ['./paso-limpieza-edit.component.scss']
})
export class PasoLimpiezaEditComponent implements OnInit {
    private service = inject(PasoLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    paso = signal<PasoLimpieza | undefined>(undefined);
    programaId = this.route.snapshot.paramMap.get('programaId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.paso.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el paso' });
        }
    }

    async onFormSubmit(dto: UpdatePasoLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el paso' });
        }
    }
}
