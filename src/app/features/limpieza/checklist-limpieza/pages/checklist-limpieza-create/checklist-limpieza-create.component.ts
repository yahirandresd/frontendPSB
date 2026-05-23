import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChecklistLimpiezaService } from '../../services/checklist-limpieza.service';
import { ChecklistLimpiezaFormComponent } from '../../components/checklist-limpieza-form/checklist-limpieza-form.component';
import { CreateChecklistLimpiezaDto } from '../../models/create-checklist-limpieza.dto';

@Component({
    selector: 'app-checklist-limpieza-create',
    standalone: true,
    imports: [ChecklistLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './checklist-limpieza-create.component.html',
    styleUrls: ['./checklist-limpieza-create.component.scss']
})
export class ChecklistLimpiezaCreateComponent {
    private service = inject(ChecklistLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    registroId = this.route.snapshot.paramMap.get('registroId')!;

    async onFormSubmit(dto: CreateChecklistLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.router.navigate(['../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el ítem' });
        }
    }
}
