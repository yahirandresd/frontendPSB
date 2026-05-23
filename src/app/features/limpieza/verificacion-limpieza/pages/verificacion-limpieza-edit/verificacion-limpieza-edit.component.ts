import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VerificacionLimpiezaService } from '../../services/verificacion-limpieza.service';
import { VerificacionLimpiezaFormComponent } from '../../components/verificacion-limpieza-form/verificacion-limpieza-form.component';
import { VerificacionLimpieza } from '../../models/verificacion-limpieza.interface';
import { UpdateVerificacionLimpiezaDto } from '../../models/update-verificacion-limpieza.dto';

@Component({
    selector: 'app-verificacion-limpieza-edit',
    standalone: true,
    imports: [VerificacionLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './verificacion-limpieza-edit.component.html',
    styleUrls: ['./verificacion-limpieza-edit.component.scss']
})
export class VerificacionLimpiezaEditComponent implements OnInit {
    private service = inject(VerificacionLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    verificacion = signal<VerificacionLimpieza | undefined>(undefined);
    registroId = this.route.snapshot.paramMap.get('registroId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.verificacion.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la verificación' });
        }
    }

    async onFormSubmit(dto: UpdateVerificacionLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la verificación' });
        }
    }
}
