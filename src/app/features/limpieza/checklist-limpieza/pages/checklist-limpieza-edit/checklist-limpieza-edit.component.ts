import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChecklistLimpiezaService } from '../../services/checklist-limpieza.service';
import { ChecklistLimpiezaFormComponent } from '../../components/checklist-limpieza-form/checklist-limpieza-form.component';
import { ChecklistLimpieza } from '../../models/checklist-limpieza.interface';
import { UpdateChecklistLimpiezaDto } from '../../models/update-checklist-limpieza.dto';

@Component({
    selector: 'app-checklist-limpieza-edit',
    standalone: true,
    imports: [ChecklistLimpiezaFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './checklist-limpieza-edit.component.html',
    styleUrls: ['./checklist-limpieza-edit.component.scss']
})
export class ChecklistLimpiezaEditComponent implements OnInit {
    private service = inject(ChecklistLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    item = signal<ChecklistLimpieza | undefined>(undefined);
    registroId = this.route.snapshot.paramMap.get('registroId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    async ngOnInit(): Promise<void> {
        try {
            this.item.set(await firstValueFrom(this.service.getById(this.id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el ítem' });
        }
    }

    async onFormSubmit(dto: UpdateChecklistLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.router.navigate(['../../'], { relativeTo: this.route });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el ítem' });
        }
    }
}
