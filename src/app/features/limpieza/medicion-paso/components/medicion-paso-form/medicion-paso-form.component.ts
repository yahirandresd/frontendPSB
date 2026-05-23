import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MedicionPaso } from '../../models/medicion-paso.interface';
import { CreateMedicionPasoDto } from '../../models/create-medicion-paso.dto';
import { UpdateMedicionPasoDto } from '../../models/update-medicion-paso.dto';

@Component({
    selector: 'app-medicion-paso-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, CheckboxModule],
    templateUrl: './medicion-paso-form.component.html',
    styleUrls: ['./medicion-paso-form.component.scss']
})
export class MedicionPasoFormComponent implements OnInit {
    @Input() medicion?: MedicionPaso;
    @Input() checklistId!: string;
    @Output() formSubmit = new EventEmitter<CreateMedicionPasoDto | UpdateMedicionPasoDto>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        checklistId:    ['', Validators.required],
        parametro:      ['', Validators.required],
        valorObtenido:  ['', Validators.required],
        valorEsperado:  [''],
        unidad:         [''],
        cumple:         [false],
        observaciones:  ['']
    });

    ngOnInit(): void {
        this.form.patchValue({ checklistId: this.checklistId });
        this.form.get('checklistId')!.disable();

        if (this.medicion) {
            this.form.patchValue(this.medicion);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.medicion) {
            const dto: UpdateMedicionPasoDto = {
                parametro:     raw.parametro     ?? undefined,
                valorObtenido: raw.valorObtenido ?? undefined,
                valorEsperado: raw.valorEsperado || undefined,
                unidad:        raw.unidad        || undefined,
                cumple:        raw.cumple        ?? undefined,
                observaciones: raw.observaciones || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateMedicionPasoDto = {
                checklistId:   raw.checklistId!,
                parametro:     raw.parametro!,
                valorObtenido: raw.valorObtenido!,
                valorEsperado: raw.valorEsperado || undefined,
                unidad:        raw.unidad        || undefined,
                cumple:        raw.cumple        ?? undefined,
                observaciones: raw.observaciones || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
