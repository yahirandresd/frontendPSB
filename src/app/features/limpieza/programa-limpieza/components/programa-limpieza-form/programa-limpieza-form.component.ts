import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';
import { CreateProgramaLimpiezaDto } from '../../models/create-programa-limpieza.dto';
import { UpdateProgramaLimpiezaDto } from '../../models/update-programa-limpieza.dto';

@Component({
    selector: 'app-programa-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule],
    templateUrl: './programa-limpieza-form.component.html',
    styleUrls: ['./programa-limpieza-form.component.scss']
})
export class ProgramaLimpiezaFormComponent implements OnInit {
    @Input() programa?: ProgramaLimpieza;
    @Output() formSubmit = new EventEmitter<CreateProgramaLimpiezaDto | UpdateProgramaLimpiezaDto>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        programaId:           ['', Validators.required],
        equipoAreaId:         [''],
        objetivo:             ['', Validators.required],
        alcance:              ['', Validators.required],
        procedimientoGeneral: ['']
    });

    get f() { return this.form.controls; }

    ngOnInit(): void {
        if (this.programa) {
            this.form.patchValue(this.programa);
            this.f['programaId'].disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const payload = this.programa
            ? { equipoAreaId: raw.equipoAreaId || undefined, objetivo: raw.objetivo, alcance: raw.alcance, procedimientoGeneral: raw.procedimientoGeneral || undefined } as UpdateProgramaLimpiezaDto
            : { programaId: raw.programaId, equipoAreaId: raw.equipoAreaId || undefined, objetivo: raw.objetivo, alcance: raw.alcance, procedimientoGeneral: raw.procedimientoGeneral || undefined } as CreateProgramaLimpiezaDto;
        this.formSubmit.emit(payload);
    }
}
