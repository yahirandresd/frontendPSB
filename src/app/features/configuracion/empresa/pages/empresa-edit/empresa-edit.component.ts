import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmpresaFormComponent, EmpresaFormValue } from '../../components/empresa-form/empresa-form.component';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.interface';

@Component({
    selector: 'app-empresa-edit',
    standalone: true,
    imports: [EmpresaFormComponent, ToastModule],
    templateUrl: './empresa-edit.component.html',
    styleUrls: ['./empresa-edit.component.scss'],
    providers: [MessageService],
})
export class EmpresaEditComponent implements OnInit {
    private service = inject(EmpresaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    empresa = signal<Empresa | undefined>(undefined);
    saving = signal(false);

    ngOnInit() { this.cargarEmpresa(); }

    async cargarEmpresa() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        try {
            const data = await firstValueFrom(this.service.getById(id));
            this.empresa.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la empresa' });
        }
    }

    async onSubmit(form: EmpresaFormValue) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.saving.set(true);
        try {
            await firstValueFrom(this.service.update(id, form));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Empresa actualizada correctamente' });
            setTimeout(() => this.router.navigate(['/configuracion-inicial']), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la empresa' });
        } finally {
            this.saving.set(false);
        }
    }

    onCancel() { this.router.navigate(['/configuracion-inicial']); }
}
