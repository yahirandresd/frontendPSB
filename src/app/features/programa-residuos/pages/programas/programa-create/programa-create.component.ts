import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaFormComponent } from '../../../components/programa-form/programa-form.component';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { CreateProgramaResiduoDto } from '../../../models/programa-residuos.models';

@Component({
    selector: 'app-programa-create',
    standalone: true,
    imports: [ProgramaFormComponent, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <h3 class="text-xl font-semibold mt-0 mb-4">Nuevo programa de residuos</h3>
            <app-programa-form (formSubmit)="onSubmit($event)" />
        </div>
    `
})
export class ProgramaCreateComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly router = inject(Router);
    private readonly toast = inject(MessageService);

    onSubmit(dto: CreateProgramaResiduoDto): void {
        this.store.createPrograma(dto).subscribe({
            next: (created) => {
                this.toast.add({ severity: 'success', summary: 'Creado', detail: 'Programa registrado' });
                this.router.navigate(['/programa-residuos/programas', created.id]);
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el programa' });
            }
        });
    }
}

