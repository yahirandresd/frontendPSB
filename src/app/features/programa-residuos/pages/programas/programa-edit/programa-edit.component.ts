import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaFormComponent } from '../../../components/programa-form/programa-form.component';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { UpdateProgramaResiduoDto, Programa } from '../../../models/programa-residuos.models';

@Component({
    selector: 'app-programa-edit',
    standalone: true,
    imports: [ProgramaFormComponent, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <h3 class="text-xl font-semibold mt-0 mb-4">Editar programa</h3>
            @if (programa()) {
                <app-programa-form [programa]="programa()!" (formSubmit)="onSubmit($event)" />
            }
        </div>
    `
})
export class ProgramaEditComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toast = inject(MessageService);

    readonly programa = signal<Programa | undefined>(undefined);

    constructor() {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.programa.set(this.store.getProgramaById(id));
    }

    onSubmit(dto: UpdateProgramaResiduoDto): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.store.updatePrograma(id, dto);
        this.toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cambios guardados' });
        this.router.navigate(['/programa-residuos/programas', id]);
    }
}

