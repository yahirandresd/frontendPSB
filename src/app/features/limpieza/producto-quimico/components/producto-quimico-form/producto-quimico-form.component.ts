import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductoQuimico } from '../../models/producto-quimico.interface';
import { CreateProductoQuimicoDto } from '../../models/create-producto-quimico.dto';
import { UpdateProductoQuimicoDto } from '../../models/update-producto-quimico.dto';

@Component({
    selector: 'app-producto-quimico-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, TextareaModule, CheckboxModule, ButtonModule],
    templateUrl: './producto-quimico-form.component.html',
    styleUrls: ['./producto-quimico-form.component.scss']
})
export class ProductoQuimicoFormComponent implements OnInit {
    @Input() producto?: ProductoQuimico;
    @Output() formSubmit = new EventEmitter<CreateProductoQuimicoDto | UpdateProductoQuimicoDto>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        empresaId:               ['', Validators.required],
        codigo:                  ['', Validators.required],
        nombre:                  ['', Validators.required],
        fabricante:              ['', Validators.required],
        registroSanitarioInvima: ['', Validators.required],
        gradoAlimenticio:        [false],
        phPuro:                  [null],
        dosificacionSugerida:    [''],
        fichaTecnicaUrl:         ['']
    });

    get f() { return this.form.controls; }

    ngOnInit(): void {
        if (this.producto) {
            this.form.patchValue(this.producto);
            this.f['empresaId'].disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const payload = this.producto
            ? {
                codigo:                  raw.codigo,
                nombre:                  raw.nombre,
                fabricante:              raw.fabricante,
                registroSanitarioInvima: raw.registroSanitarioInvima,
                gradoAlimenticio:        raw.gradoAlimenticio,
                phPuro:                  raw.phPuro ?? undefined,
                dosificacionSugerida:    raw.dosificacionSugerida || undefined,
                fichaTecnicaUrl:         raw.fichaTecnicaUrl || undefined
              } as UpdateProductoQuimicoDto
            : {
                empresaId:               raw.empresaId,
                codigo:                  raw.codigo,
                nombre:                  raw.nombre,
                fabricante:              raw.fabricante,
                registroSanitarioInvima: raw.registroSanitarioInvima,
                gradoAlimenticio:        raw.gradoAlimenticio,
                phPuro:                  raw.phPuro ?? undefined,
                dosificacionSugerida:    raw.dosificacionSugerida || undefined,
                fichaTecnicaUrl:         raw.fichaTecnicaUrl || undefined
              } as CreateProductoQuimicoDto;
        this.formSubmit.emit(payload);
    }
}
