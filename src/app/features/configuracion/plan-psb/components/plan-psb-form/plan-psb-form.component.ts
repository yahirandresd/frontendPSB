import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { firstValueFrom } from 'rxjs';
import { PlanPsb, NivelRiesgo, EstadoPlan } from '../../models/plan-psb.interface';
import { CreatePlanPsbDto } from '../../models/create-plan-psb.dto';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Empresa } from '../../../empresa/models/empresa.interface';

export type PlanPsbFormValue = CreatePlanPsbDto;

@Component({
    selector: 'app-plan-psb-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, CheckboxModule, TagModule],
    templateUrl: './plan-psb-form.component.html',
    styleUrls: ['./plan-psb-form.component.scss'],
})
export class PlanPsbFormComponent implements OnInit {
    @Input() plan?: PlanPsb;
    @Input() saving = false;

    @Output() formSubmit = new EventEmitter<PlanPsbFormValue>();
    @Output() cancel = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private empresaService = inject(EmpresaService);

    empresas = signal<Empresa[]>([]);

    estadoOptions: { label: string; value: EstadoPlan }[] = [
        { label: 'Borrador', value: 'BORRADOR' },
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'En revisión', value: 'EN_REVISION' },
        { label: 'Vencido', value: 'VENCIDO' },
    ];

    nivelRiesgoOptions: { label: string; value: NivelRiesgo }[] = [
        { label: 'Alto', value: 'ALTO' },
        { label: 'Medio', value: 'MEDIO' },
        { label: 'Bajo', value: 'BAJO' },
    ];

    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        version: ['1.0', Validators.required],
        estado: ['BORRADOR', Validators.required],
        nivel_riesgo: [null, Validators.required],
        activo: [true],
        empresaId: [null, Validators.required],
    });

    async ngOnInit() {
        try {
            const data = await firstValueFrom(this.empresaService.getAll());
            this.empresas.set(data);
        } catch (e) {
            console.error('Error cargando empresas:', e);
        }

        if (this.plan) {
            this.form.patchValue({
                nombre: `Plan PSB v${this.plan.version}`,
                version: this.plan.version,
                estado: this.plan.estado,
                nivel_riesgo: this.plan.nivel_riesgo,
                activo: true,
                empresaId: this.plan.empresa?.id ?? null,
            });
        }
    }

    get f() { return this.form.controls; }

    riesgoSeverity(nivel: NivelRiesgo): 'danger' | 'warn' | 'success' {
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = { ALTO: 'danger', MEDIO: 'warn', BAJO: 'success' };
        return map[nivel];
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.formSubmit.emit(this.form.value as PlanPsbFormValue);
    }

    onCancel() { this.cancel.emit(); }
}
