import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AnalisisLaboratorioFormComponent } from '../../components/analisis-laboratorio-form/analisis-laboratorio-form.component';
import { AnalisisLaboratorioService } from '../../services/analisis-laboratorio.service';
import { AnalisisLaboratorio } from '../../models/analisis-laboratorio.interface';

@Component({
    selector: 'app-analisis-laboratorio-edit',
    standalone: true,
    imports: [AnalisisLaboratorioFormComponent, ToastModule],
    templateUrl: './analisis-laboratorio-edit.component.html',
    styleUrls: ['./analisis-laboratorio-edit.component.scss'],
    providers: [MessageService],
})
export class AnalisisLaboratorioEditComponent implements OnInit {
    private service = inject(AnalisisLaboratorioService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    analisisLaboratorio = signal<AnalisisLaboratorio | undefined>(undefined);
    saving = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.analisisLaboratorio.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/analisis-laboratorio']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/analisis-laboratorio']); }
}