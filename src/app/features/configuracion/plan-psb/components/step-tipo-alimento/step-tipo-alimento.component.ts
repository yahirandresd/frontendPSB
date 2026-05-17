import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { TipoAlimento, NivelRiesgo } from '../../../tipo-alimento/models/tipo-alimento.interface';

@Component({
    selector: 'app-step-tipo-alimento',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, SelectModule, TableModule, TagModule, ButtonModule, TextareaModule],
    templateUrl: './step-tipo-alimento.component.html',
    styleUrls: ['./step-tipo-alimento.component.scss']
})
export class StepTipoAlimentoComponent implements OnInit {
    @Output() next = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    wizardService = inject(WizardConfiguracionService);

    tiposAlimento: Partial<TipoAlimento>[] = [];

    nivelesRiesgo = [
        { label: 'Alto', value: 'ALTO' },
        { label: 'Medio', value: 'MEDIO' },
        { label: 'Bajo', value: 'BAJO' }
    ];

    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        nivel_riesgo: [null, Validators.required],
        descripcion: ['']
    });

    ngOnInit(): void {
        this.tiposAlimento = [...this.wizardService.getSnapshot().tiposAlimento];
    }

    get f() {
        return this.form.controls;
    }

    getSeverity(nivel: NivelRiesgo): 'danger' | 'warn' | 'success' {
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = {
            ALTO: 'danger',
            MEDIO: 'warn',
            BAJO: 'success'
        };
        return map[nivel];
    }

    onAgregar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.tiposAlimento = [...this.tiposAlimento, { ...this.form.value }];
        this.wizardService.setTiposAlimento(this.tiposAlimento);
        this.form.reset();
    }

    onEliminar(index: number): void {
        this.tiposAlimento = this.tiposAlimento.filter((_, i) => i !== index);
        this.wizardService.setTiposAlimento(this.tiposAlimento);
    }

    onNext(): void {
        if (this.tiposAlimento.length === 0) return;
        this.next.emit();
    }

    onBack(): void {
        this.back.emit();
    }
}
