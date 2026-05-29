import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductoQuimico } from '../../models/producto-quimico.interface';
import { CreateProductoQuimicoDto } from '../../models/create-producto-quimico.dto';
import { UpdateProductoQuimicoDto } from '../../models/update-producto-quimico.dto';

@Component({
    selector: 'app-producto-quimico-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, SelectModule, CheckboxModule, ButtonModule],
    templateUrl: './producto-quimico-form.component.html',
    styleUrls: ['./producto-quimico-form.component.scss']
})
export class ProductoQuimicoFormComponent implements OnInit {
    @Input() producto?: ProductoQuimico;
    @Output() formSubmit = new EventEmitter<CreateProductoQuimicoDto | UpdateProductoQuimicoDto>();

    private fb = inject(FormBuilder);

    tipoOpciones = [
        { label: 'Desinfectante',  value: 'desinfectante'  },
        { label: 'Detergente',     value: 'detergente'     },
        { label: 'Sanitizante',    value: 'sanitizante'    },
        { label: 'Desengrasante',  value: 'desengrasante'  },
        { label: 'Esterilizante',  value: 'esterilizante'  },
    ];

    form: FormGroup = this.fb.group({
        codigo:                  ['', Validators.required],
        nombre:                  ['', Validators.required],
        fabricante:              ['', Validators.required],
        tipo:                    ['', Validators.required],
        gradoAlimenticio:        [false],
        ph:                      [''],
        concentracionRecomendada: [''],
        tiempoContactoMin:       [''],
        fichaTecnicaUrl:         ['']
    });

    get f() { return this.form.controls; }

    ngOnInit(): void {
        if (this.producto) {
            this.form.patchValue(this.producto);
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
                tipo:                    raw.tipo,
                gradoAlimenticio:        raw.gradoAlimenticio,
                ph:                      raw.ph || undefined,
                concentracionRecomendada: raw.concentracionRecomendada || undefined,
                tiempoContactoMin:       raw.tiempoContactoMin || undefined,
                fichaTecnicaUrl:         raw.fichaTecnicaUrl || undefined
              } as UpdateProductoQuimicoDto
            : {
                codigo:                  raw.codigo,
                nombre:                  raw.nombre,
                fabricante:              raw.fabricante,
                tipo:                    raw.tipo,
                gradoAlimenticio:        raw.gradoAlimenticio,
                ph:                      raw.ph || undefined,
                concentracionRecomendada: raw.concentracionRecomendada || undefined,
                tiempoContactoMin:       raw.tiempoContactoMin || undefined,
                fichaTecnicaUrl:         raw.fichaTecnicaUrl || undefined
              } as CreateProductoQuimicoDto;
        this.formSubmit.emit(payload);
    }
}
