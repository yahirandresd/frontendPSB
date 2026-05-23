import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasoLimpiezaPq } from '../../models/paso-limpieza-pq.interface';
import { CreatePasoLimpiezaPqDto } from '../../models/create-paso-limpieza-pq.dto';
import { UpdatePasoLimpiezaPqDto } from '../../models/update-paso-limpieza-pq.dto';

@Component({
    selector: 'app-paso-limpieza-pq-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule],
    templateUrl: './paso-limpieza-pq-form.component.html',
    styleUrls: ['./paso-limpieza-pq-form.component.scss']
})
export class PasoLimpiezaPqFormComponent implements OnInit {
    @Input() pq?: PasoLimpiezaPq;
    @Input() pasoId!: string;
    @Output() formSubmit = new EventEmitter<CreatePasoLimpiezaPqDto | UpdatePasoLimpiezaPqDto>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        pasoId:         ['', Validators.required],
        nombreProducto: ['', Validators.required],
        concentracion:  [''],
        dosis:          [''],
        unidadMedida:   [''],
        tiempoContacto: ['']
    });

    ngOnInit(): void {
        this.form.patchValue({ pasoId: this.pasoId });
        this.form.get('pasoId')!.disable();

        if (this.pq) {
            this.form.patchValue(this.pq);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.pq) {
            const dto: UpdatePasoLimpiezaPqDto = {
                nombreProducto: raw.nombreProducto ?? undefined,
                concentracion:  raw.concentracion  || undefined,
                dosis:          raw.dosis          || undefined,
                unidadMedida:   raw.unidadMedida   || undefined,
                tiempoContacto: raw.tiempoContacto || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreatePasoLimpiezaPqDto = {
                pasoId:         raw.pasoId!,
                nombreProducto: raw.nombreProducto!,
                concentracion:  raw.concentracion  || undefined,
                dosis:          raw.dosis          || undefined,
                unidadMedida:   raw.unidadMedida   || undefined,
                tiempoContacto: raw.tiempoContacto || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
