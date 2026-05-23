import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { VerificacionLimpieza } from '../../models/verificacion-limpieza.interface';
import { CreateVerificacionLimpiezaDto } from '../../models/create-verificacion-limpieza.dto';
import { UpdateVerificacionLimpiezaDto } from '../../models/update-verificacion-limpieza.dto';

type Resultado = 'aprobado' | 'rechazado' | 'observacion';

@Component({
    selector: 'app-verificacion-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule],
    templateUrl: './verificacion-limpieza-form.component.html',
    styleUrls: ['./verificacion-limpieza-form.component.scss']
})
export class VerificacionLimpiezaFormComponent implements OnInit {
    @Input() verificacion?: VerificacionLimpieza;
    @Input() registroId!: string;
    @Output() formSubmit = new EventEmitter<CreateVerificacionLimpiezaDto | UpdateVerificacionLimpiezaDto>();

    private fb = inject(FormBuilder);

    resultadoOpciones: { label: string; value: Resultado }[] = [
        { label: 'Aprobado',    value: 'aprobado'    },
        { label: 'Rechazado',   value: 'rechazado'   },
        { label: 'Observación', value: 'observacion' }
    ];

    form = this.fb.group({
        registroId:       ['', Validators.required],
        verificadoPor:    ['', Validators.required],
        fecha:            [new Date().toISOString().split('T')[0], Validators.required],
        resultado:        ['aprobado' as Resultado, Validators.required],
        observaciones:    [''],
        accionCorrectiva: ['']
    });

    ngOnInit(): void {
        this.form.patchValue({ registroId: this.registroId });
        this.form.get('registroId')!.disable();

        if (this.verificacion) {
            this.form.patchValue({
                ...this.verificacion,
                fecha: this.verificacion.fecha.split('T')[0]
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.verificacion) {
            const dto: UpdateVerificacionLimpiezaDto = {
                verificadoPor:    raw.verificadoPor    ?? undefined,
                fecha:            raw.fecha            ?? undefined,
                resultado:        raw.resultado        as Resultado | undefined,
                observaciones:    raw.observaciones    || undefined,
                accionCorrectiva: raw.accionCorrectiva || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateVerificacionLimpiezaDto = {
                registroId:       raw.registroId!,
                verificadoPor:    raw.verificadoPor!,
                fecha:            raw.fecha!,
                resultado:        raw.resultado        as Resultado,
                observaciones:    raw.observaciones    || undefined,
                accionCorrectiva: raw.accionCorrectiva || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
