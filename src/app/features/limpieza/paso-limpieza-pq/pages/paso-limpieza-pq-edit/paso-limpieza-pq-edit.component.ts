import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasoLimpiezaPqService } from '../../services/paso-limpieza-pq.service';
import { PasoLimpiezaPqFormComponent } from '../../components/paso-limpieza-pq-form/paso-limpieza-pq-form.component';
import { PasoLimpiezaPq } from '../../models/paso-limpieza-pq.interface';
import { UpdatePasoLimpiezaPqDto } from '../../models/update-paso-limpieza-pq.dto';

@Component({
    selector: 'app-paso-limpieza-pq-edit',
    standalone: true,
    imports: [PasoLimpiezaPqFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './paso-limpieza-pq-edit.component.html',
    styleUrls: ['./paso-limpieza-pq-edit.component.scss']
})
export class PasoLimpiezaPqEditComponent implements OnInit {
    private service = inject(PasoLimpiezaPqService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    pq = signal<PasoLimpiezaPq | undefined>(undefined);
    pasoId = this.route.snapshot.paramMap.get('pasoId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.pq.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el producto' });
        }
    }

    async onFormSubmit(dto: UpdatePasoLimpiezaPqDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto' });
        }
    }
}
