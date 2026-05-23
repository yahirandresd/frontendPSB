import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { Programa, FrecuenciaPrograma, CreateProgramaResiduoDto } from '../../models/programa-residuos.models';
import { FRECUENCIA_PROGRAMA_LABELS } from '../../utils/programa-residuos.labels';

@Component({
    selector: 'app-programa-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule],
    templateUrl: './programa-form.component.html',
    styleUrls: ['./programa-form.component.scss']
})
export class ProgramaFormComponent {
    readonly programa = input<Programa>();
    readonly formSubmit = output<CreateProgramaResiduoDto>();

    readonly frecuencias = (Object.keys(FRECUENCIA_PROGRAMA_LABELS) as FrecuenciaPrograma[]).map((k) => ({
        label: FRECUENCIA_PROGRAMA_LABELS[k],
        value: k
    }));

    private readonly fb = new FormBuilder();

    readonly form = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        responsable: ['', Validators.required],
        frecuencia: [FrecuenciaPrograma.SEMANAL, Validators.required],
        objetivo: ['', Validators.required],
        alcance: ['', Validators.required],
        procedimiento_general: ['', Validators.required]
    });

    constructor() {
        effect(() => {
            const p = this.programa();
            if (!p) return;
            this.form.patchValue({
                nombre: p.nombre,
                descripcion: p.descripcion,
                responsable: p.responsable,
                frecuencia: p.frecuencia,
                objetivo: p.programaResiduo?.objetivo || '',
                alcance: p.programaResiduo?.alcance || '',
                procedimiento_general: p.programaResiduo?.procedimiento_general || ''
            });
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        this.formSubmit.emit({
            nombre: v.nombre!,
            descripcion: v.descripcion!,
            responsable: v.responsable!,
            frecuencia: v.frecuencia!,
            objetivo: v.objetivo!,
            alcance: v.alcance!,
            procedimiento_general: v.procedimiento_general!
        });
    }
}
