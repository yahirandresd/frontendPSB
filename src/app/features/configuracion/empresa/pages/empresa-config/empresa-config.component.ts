import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmpresaFormComponent, EmpresaFormValue } from '../../components/empresa-form/empresa-form.component';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.interface';

@Component({
    selector: 'app-empresa-config',
    standalone: true,
    imports: [EmpresaFormComponent, ToastModule],
    templateUrl: './empresa-config.component.html',
    styleUrls: ['./empresa-config.component.scss'],
    providers: [MessageService],
})
export class EmpresaConfigComponent implements OnInit {
    private service = inject(EmpresaService);
    private messageService = inject(MessageService);

    empresa = signal<Empresa | undefined>(undefined);
    saving = signal(false);
    loading = signal(true);

    private empresaId: string | null = null;

    ngOnInit() { this.cargarEmpresa(); }

    async cargarEmpresa() {
        this.loading.set(true);
        try {
            const lista = await firstValueFrom(this.service.getAll());
            if (lista.length > 0) {
                this.empresa.set(lista[0]);
                this.empresaId = lista[0].id;
            }
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de la empresa' });
        } finally {
            this.loading.set(false);
        }
    }

    async onSubmit(form: EmpresaFormValue) {
        this.saving.set(true);
        try {
            if (this.empresaId) {
                const updated = await firstValueFrom(this.service.update(this.empresaId, form));
                this.empresa.set(updated);
            } else {
                const created = await firstValueFrom(this.service.create(form));
                this.empresa.set(created);
                this.empresaId = created.id;
            }
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Datos de la empresa guardados correctamente' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los datos' });
        } finally {
            this.saving.set(false);
        }
    }
}
