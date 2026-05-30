import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { RegistroLimpieza } from '../../models/registro-limpieza.interface';
import { CreateRegistroLimpiezaDto } from '../../models/create-registro-limpieza.dto';
import { UpdateRegistroLimpiezaDto } from '../../models/update-registro-limpieza.dto';

@Component({
    selector: 'app-registro-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, DividerModule],
    templateUrl: './registro-limpieza-form.component.html',
    styleUrls: ['./registro-limpieza-form.component.scss']
})
export class RegistroLimpiezaFormComponent implements OnInit {
    @Input() registro?: RegistroLimpieza;
    @Input() programaId!: string;
    @Output() formSubmit = new EventEmitter<CreateRegistroLimpiezaDto | UpdateRegistroLimpiezaDto>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        // campos de solo lectura (modo edición)
        fecha:              [''],
        realizadoPor:       [''],
        estado:             [''],
        observaciones:      [''],
        // campos editables
        superficieLimpiada: ['', Validators.required],
        resultadoInspeccion:['']
    });

    ngOnInit(): void {
        if (this.registro) {
            this.form.patchValue({
                fecha:               this.registro.registro.fecha.split('T')[0],
                realizadoPor:        this.registro.registro.usuario?.nombre ?? '',
                estado:              this.registro.registro.estado,
                observaciones:       this.registro.registro.observaciones ?? '',
                superficieLimpiada:  this.registro.superficieLimpiada,
                resultadoInspeccion: this.registro.resultadoInspeccion ?? ''
            });
            this.form.get('fecha')!.disable();
            this.form.get('realizadoPor')!.disable();
            this.form.get('estado')!.disable();
            this.form.get('observaciones')!.disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.registro) {
            const dto: UpdateRegistroLimpiezaDto = {
                superficieLimpiada:  raw.superficieLimpiada  || undefined,
                resultadoInspeccion: raw.resultadoInspeccion || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateRegistroLimpiezaDto = {
                registroId:          '',
                programaLimpiezaId:  this.programaId,
                superficieLimpiada:  raw.superficieLimpiada!,
                resultadoInspeccion: raw.resultadoInspeccion || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
