import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';

function nitColombiano(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;
    return /^\d{3}\.\d{3}\.\d{3}-\d$/.test(value) ? null : { nitInvalido: true };
}

@Component({
    selector: 'app-step-empresa',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
    templateUrl: './step-empresa.component.html',
    styleUrls: ['./step-empresa.component.scss']
})
export class StepEmpresaComponent {
    @Output() next = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    wizardService = inject(WizardConfiguracionService);

    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        nit: ['', [Validators.required, nitColombiano]],
        tipo_negocio: ['', Validators.required],
        direccion: ['', Validators.required],
        representante: ['', Validators.required],
        registro_sanitario_funcionamiento: [''],
        resolucion_invima: ['']
    });

    get f() {
        return this.form.controls;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.wizardService.setEmpresa(this.form.value);
        this.next.emit();
    }
}
