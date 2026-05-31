import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RegistroLimpiezaService } from '../../services/registro-limpieza.service';
import { RegistroLimpiezaFormComponent } from '../../components/registro-limpieza-form/registro-limpieza-form.component';
import { RegistroLimpieza } from '../../models/registro-limpieza.interface';
import { UpdateRegistroLimpiezaDto } from '../../models/update-registro-limpieza.dto';

@Component({
    selector: 'app-registro-limpieza-edit',
    standalone: true,
    imports: [RegistroLimpiezaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './registro-limpieza-edit.component.html',
    styleUrls: ['./registro-limpieza-edit.component.scss']
})
export class RegistroLimpiezaEditComponent implements OnInit {
    private service = inject(RegistroLimpiezaService);
    private router = inject(Router);
    private location = inject(Location);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    registro = signal<RegistroLimpieza | undefined>(undefined);
    programaId = this.route.snapshot.paramMap.get('programaId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    volver(): void { this.location.back(); }

    async ngOnInit(): Promise<void> {
        try {
            this.registro.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el registro' });
        }
    }

    async onFormSubmit(dto: UpdateRegistroLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
        }
    }
}
