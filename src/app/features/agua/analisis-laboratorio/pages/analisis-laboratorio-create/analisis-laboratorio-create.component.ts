import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AnalisisLaboratorioFormComponent } from '../../components/analisis-laboratorio-form/analisis-laboratorio-form.component';
import { AnalisisLaboratorioService } from '../../services/analisis-laboratorio.service';

@Component({
    selector: 'app-analisis-laboratorio-create',
    standalone: true,
    imports: [AnalisisLaboratorioFormComponent, ToastModule],
    templateUrl: './analisis-laboratorio-create.component.html',
    styleUrls: ['./analisis-laboratorio-create.component.scss'],
    providers: [MessageService],
})
export class AnalisisLaboratorioCreateComponent {
    private service = inject(AnalisisLaboratorioService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    saving = signal(false);
    async onSubmit(data: any) {
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.create(data));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Creado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/analisis-laboratorio']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/analisis-laboratorio']); }
}