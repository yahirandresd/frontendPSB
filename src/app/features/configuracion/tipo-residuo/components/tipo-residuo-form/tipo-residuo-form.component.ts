import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TipoResiduo } from '../../models/tipo-residuo.interface';
import { CreateTipoResiduoDto } from '../../models/create-tipo-residuo.dto';

@Component({
    selector: 'app-tipo-residuo-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        CheckboxModule,
        ColorPickerModule
    ],
    templateUrl: './tipo-residuo-form.component.html',
    styleUrls: ['./tipo-residuo-form.component.scss']
})
export class TipoResiduoFormComponent implements OnInit {
    @Input() tipoResiduo?: TipoResiduo;
    @Output() formSubmit = new EventEmitter<CreateTipoResiduoDto>();
    @Output() cancelar = new EventEmitter<void>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        descripcion: ['', [Validators.required]],
        color_contenedor: ['#4CAF50', [Validators.required]],
        es_peligroso: [false]
    });

    ngOnInit(): void {
        if (this.tipoResiduo) {
            this.form.patchValue({
                nombre: this.tipoResiduo.nombre,
                descripcion: this.tipoResiduo.descripcion,
                color_contenedor: this.tipoResiduo.color_contenedor,
                es_peligroso: this.tipoResiduo.es_peligroso
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.formSubmit.emit(this.form.value as CreateTipoResiduoDto);
    }

    onCancelar(): void {
        this.cancelar.emit();
    }

    get nombre() { return this.form.get('nombre'); }
    get descripcion() { return this.form.get('descripcion'); }
    get color_contenedor() { return this.form.get('color_contenedor'); }
}
