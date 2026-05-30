import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RegistroLimpieza } from '../../models/registro-limpieza.interface';
import { CreateRegistroLimpiezaDto } from '../../models/create-registro-limpieza.dto';
import { UpdateRegistroLimpiezaDto } from '../../models/update-registro-limpieza.dto';

type Estado = 'pendiente' | 'en_proceso' | 'completado' | 'con_novedad';

@Component({
    selector: 'app-registro-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, DatePickerModule],
    templateUrl: './registro-limpieza-form.component.html',
    styleUrls: ['./registro-limpieza-form.component.scss']
})
export class RegistroLimpiezaFormComponent implements OnInit {
    @Input() registro?: RegistroLimpieza;
    @Input() programaId!: string;
    @Output() formSubmit = new EventEmitter<CreateRegistroLimpiezaDto | UpdateRegistroLimpiezaDto>();

    private fb = inject(FormBuilder);

    estadoOpciones: { label: string; value: Estado }[] = [
        { label: 'Pendiente',    value: 'pendiente'   },
        { label: 'En proceso',   value: 'en_proceso'  },
        { label: 'Completado',   value: 'completado'  },
        { label: 'Con novedad',  value: 'con_novedad' }
    ];

    form = this.fb.group({
        programaId:    ['', Validators.required],
        fecha:         [new Date().toISOString().split('T')[0], Validators.required],
        realizadoPor:  ['', Validators.required],
        observaciones: [''],
        estado:        ['pendiente' as Estado, Validators.required]
    });

    ngOnInit(): void {
        this.form.patchValue({ programaId: this.programaId });
        this.form.get('programaId')!.disable();

        if (this.registro) {
            this.form.patchValue({
                fecha:         this.registro.registro.fecha.split('T')[0],
                observaciones: this.registro.registro.observaciones ?? '',
                estado:        this.registro.registro.estado
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.registro) {
            const dto: UpdateRegistroLimpiezaDto = {
                fecha:         raw.fecha         ?? undefined,
                realizadoPor:  raw.realizadoPor  ?? undefined,
                observaciones: raw.observaciones || undefined,
                estado:        raw.estado        as Estado | undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateRegistroLimpiezaDto = {
                programaId:    raw.programaId!,
                fecha:         raw.fecha!,
                realizadoPor:  raw.realizadoPor!,
                observaciones: raw.observaciones || undefined,
                estado:        raw.estado        as Estado | undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
