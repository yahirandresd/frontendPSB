import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MantenimientoLavadoFormComponent } from '../../components/mantenimiento-lavado-form/mantenimiento-lavado-form.component';
import { MantenimientoLavadoService } from '../../services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../models/mantenimiento-lavado.interface';

@Component({
    selector: 'app-mantenimiento-lavado-edit',
    standalone: true,
    imports: [MantenimientoLavadoFormComponent, ToastModule],
    templateUrl: './mantenimiento-lavado-edit.component.html',
    styleUrls: ['./mantenimiento-lavado-edit.component.scss'],
    providers: [MessageService],
})
export class MantenimientoLavadoEditComponent implements OnInit {
    private service = inject(MantenimientoLavadoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    mantenimientoLavado = signal<MantenimientoLavado | undefined>(undefined);
    saving = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try { this.mantenimientoLavado.set(await firstValueFrom(this.service.getById(id))); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
    }
    async onSubmit(data: any) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, data));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/programa-agua/mantenimiento-lavado']), 1000);
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }); }
        finally { this.saving.set(false); }
    }
    onCancel() { this.router.navigate(['/programa-agua/mantenimiento-lavado']); }
}