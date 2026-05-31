import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ChecklistLimpiezaService } from '../../services/checklist-limpieza.service';
import { ChecklistLimpiezaFormComponent } from '../../components/checklist-limpieza-form/checklist-limpieza-form.component';
import { ChecklistLimpieza } from '../../models/checklist-limpieza.interface';
import { UpdateChecklistLimpiezaDto } from '../../models/update-checklist-limpieza.dto';

@Component({
    selector: 'app-checklist-limpieza-edit',
    standalone: true,
    imports: [ChecklistLimpiezaFormComponent, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './checklist-limpieza-edit.component.html',
    styleUrls: ['./checklist-limpieza-edit.component.scss']
})
export class ChecklistLimpiezaEditComponent implements OnInit {
    private service = inject(ChecklistLimpiezaService);
    private router = inject(Router);
    private location = inject(Location);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    item = signal<ChecklistLimpieza | undefined>(undefined);
    registroLimpiezaId = this.route.snapshot.paramMap.get('registroId')!;
    programaId = this.route.snapshot.paramMap.get('programaId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    volver(): void { this.location.back(); }

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
