import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Empresa } from '../../models/empresa.interface';

export interface EmpresaFormValue {
    nombre: string;
    nit: string;
    tipoNegocio: string;
    direccion: string;
    representante: string;
    registroSanitarioFuncionamiento: string;
    resolucionInvima: string;
}

@Component({
    selector: 'app-empresa-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './empresa-form.component.html',
    styleUrls: ['./empresa-form.component.scss'],
})
export class EmpresaFormComponent implements OnInit {
    @Input() empresa?: Empresa;
    @Input() saving = false;

    @Output() formSubmit = new EventEmitter<EmpresaFormValue>();
    @Output() cancel = new EventEmitter<void>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        nit: ['', Validators.required],
        tipoNegocio: ['', Validators.required],
        direccion: ['', Validators.required],
        representante: ['', Validators.required],
        registroSanitarioFuncionamiento: [''],
        resolucionInvima: [''],
    });

    ngOnInit() {
        if (this.empresa) {
            this.form.patchValue({
                nombre: this.empresa.nombre,
                nit: this.empresa.nit,
                tipoNegocio: this.empresa.tipoNegocio,
                direccion: this.empresa.direccion,
                representante: this.empresa.representante,
                registroSanitarioFuncionamiento: this.empresa.registroSanitarioFuncionamiento ?? '',
                resolucionInvima: this.empresa.resolucionInvima ?? '',
            });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.formSubmit.emit(this.form.value);
    }

    onCancel() { this.cancel.emit(); }
}
