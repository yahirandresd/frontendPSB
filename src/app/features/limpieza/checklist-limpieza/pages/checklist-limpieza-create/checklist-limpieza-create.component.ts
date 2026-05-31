import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ChecklistLimpiezaService } from '../../services/checklist-limpieza.service';
import { ChecklistLimpiezaFormComponent } from '../../components/checklist-limpieza-form/checklist-limpieza-form.component';
import { CreateChecklistLimpiezaDto } from '../../models/create-checklist-limpieza.dto';

@Component({
    selector: 'app-checklist-limpieza-create',
    standalone: true,
    imports: [ChecklistLimpiezaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './checklist-limpieza-create.component.html',
    styleUrls: ['./checklist-limpieza-create.component.scss']
})
export class ChecklistLimpiezaCreateComponent {
    private service = inject(ChecklistLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private messageService = inject(MessageService);

    registroLimpiezaId = this.route.snapshot.paramMap.get('registroId')!;
    programaId = this.route.snapshot.paramMap.get('programaId')!;

    volver(): void { this.location.back(); }

    async onFormSubmit(dto: CreateChecklistLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el ítem' });
        }
    }
}
