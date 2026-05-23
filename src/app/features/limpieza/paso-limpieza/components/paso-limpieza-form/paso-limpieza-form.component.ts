import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { PasoLimpieza } from '../../models/paso-limpieza.interface';
import { CreatePasoLimpiezaDto } from '../../models/create-paso-limpieza.dto';
import { UpdatePasoLimpiezaDto } from '../../models/update-paso-limpieza.dto';

@Component({
    selector: 'app-paso-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, TextareaModule, ButtonModule],
    templateUrl: './paso-limpieza-form.component.html',
    styleUrls: ['./paso-limpieza-form.component.scss']
})
export class PasoLimpiezaFormComponent implements OnInit {
    @Input() paso?: PasoLimpieza;
    @Input() programaLimpiezaId!: string;
    @Output() formSubmit = new EventEmitter<CreatePasoLimpiezaDto | UpdatePasoLimpiezaDto>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        orden:                  [null, [Validators.required, Validators.min(1)]],
        descripcion:            ['', Validators.required],
        tipoAccion:             ['', Validators.required],
        frecuencia:             ['', Validators.required],
        concentracion:          [''],
        tiempoContacto:         [''],
        observaciones:          [''],
        temperaturaAguaMinima:  [null],
        temperaturaAguaMaxima:  [null]
    });

    get f() { return this.form.controls; }

    ngOnInit(): void {
        if (this.paso) {
            this.form.patchValue(this.paso);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const base = {
            orden: raw.orden,
            descripcion: raw.descripcion,
            tipoAccion: raw.tipoAccion,
            frecuencia: raw.frecuencia,
            concentracion: raw.concentracion || undefined,
            tiempoContacto: raw.tiempoContacto || undefined,
            observaciones: raw.observaciones || undefined,
            temperaturaAguaMinima: raw.temperaturaAguaMinima ?? undefined,
            temperaturaAguaMaxima: raw.temperaturaAguaMaxima ?? undefined
        };
        const payload = this.paso
            ? base as UpdatePasoLimpiezaDto
            : { ...base, programaLimpiezaId: this.programaLimpiezaId } as CreatePasoLimpiezaDto;
        this.formSubmit.emit(payload);
    }
}
