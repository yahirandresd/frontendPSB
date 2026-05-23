import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ControlPotabilidadFormComponent } from '../../components/control-potabilidad-form/control-potabilidad-form.component';
import { ControlPotabilidadService } from '../../services/control-potabilidad.service';
import { ControlPotabilidad } from '../../models/control-potabilidad.interface';

@Component({
    selector: 'app-control-potabilidad-edit',
    standalone: true,
    imports: [ControlPotabilidadFormComponent, ToastModule],
    templateUrl: './control-potabilidad-edit.component.html',
    styleUrls: ['./control-potabilidad-edit.component.scss'],
    providers: [MessageService],
})
export class ControlPotabilidadEditComponent implements OnInit {
    private service = inject(ControlPotabilidadService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    controlPotabilidad = signal<ControlPotabilidad | undefined>(undefined);
    saving = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.controlPotabilidad.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/control-potabilidad']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/control-potabilidad']); }
}