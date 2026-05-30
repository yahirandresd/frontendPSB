import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { PlanPsb, NivelRiesgo, EstadoPlan } from '../../models/plan-psb.interface';
import { CreatePlanPsbDto } from '../../models/create-plan-psb.dto';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Empresa } from '../../../empresa/models/empresa.interface';
import { TipoAlimentoService } from '../../../tipo-alimento/services/tipo-alimento.service';
import { TipoAlimento } from '../../../tipo-alimento/models/tipo-alimento.interface';

export type PlanPsbFormValue = CreatePlanPsbDto;

@Component({
    selector: 'app-plan-psb-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TagModule, DividerModule],
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
    private tipoAlimentoService = inject(TipoAlimentoService);

    empresas = signal<Empresa[]>([]);
    tiposAlimento = signal<TipoAlimento[]>([]);
    nivelRiesgoActual = signal<NivelRiesgo | null>(null);

    estadoOptions: { label: string; value: string }[] = [
        { label: 'Borrador',    value: 'BORRADOR'    },
        { label: 'Activo',      value: 'ACTIVO'      },
        { label: 'Vigente',     value: 'VIGENTE'     },
        { label: 'En revisión', value: 'EN_REVISION' },
        { label: 'Vencido',     value: 'VENCIDO'     },
    ];

    form: FormGroup = this.fb.group({
        nombre:         ['', Validators.required],
        descripcion:    ['', Validators.required],
        version:        [{ value: '1.0', disabled: true }],
        estado:         ['BORRADOR', Validators.required],
        empresaId:      [null, Validators.required],
        tipoAlimentoId: [null, Validators.required],
    });

    get modoEdicion(): boolean { return !!this.plan; }
    get f() { return this.form.controls; }

    async ngOnInit() {
        this.form.get('tipoAlimentoId')!.valueChanges.subscribe((id: string | null) => {
            const tipo = id !== null ? this.tiposAlimento().find(t => t.id === id) ?? null : null;
            const nivel = tipo ? (tipo.nivel_riesgo.toUpperCase() as NivelRiesgo) : null;
            this.nivelRiesgoActual.set(nivel);
        });

        if (this.modoEdicion) {
            this.form.patchValue({
                nombre:         this.plan!.nombre,
                descripcion:    this.plan!.descripcion ?? '',
                estado:         this.plan!.estado.toUpperCase(),
                empresaId:      this.plan!.empresa?.id ?? null,
                tipoAlimentoId: this.plan!.tipoAlimento?.id ?? null,
            });
            this.form.get('nombre')!.disable();
            this.form.get('tipoAlimentoId')!.disable();
            this.nivelRiesgoActual.set(this.plan!.nivel_riesgo.toUpperCase() as NivelRiesgo);
        }

        const [empresas, tiposAlimento] = await Promise.all([
            firstValueFrom(this.empresaService.getAll()).catch(() => [] as Empresa[]),
            firstValueFrom(this.tipoAlimentoService.getAll()).catch(() => [] as TipoAlimento[]),
        ]);
        this.empresas.set(empresas);
        this.tiposAlimento.set(tiposAlimento);
    }

    riesgoSeverity(nivel: NivelRiesgo | null): 'danger' | 'warn' | 'success' | 'secondary' {
        if (!nivel) return 'secondary';
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = {
            ALTO: 'danger', MEDIO: 'warn', BAJO: 'success',
        };
        return map[nivel];
    }

    riesgoLabel(nivel: NivelRiesgo | null): string {
        if (!nivel) return '';
        return { ALTO: 'Alto', MEDIO: 'Medio', BAJO: 'Bajo' }[nivel];
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const { tipoAlimentoId, ...raw } = this.form.getRawValue();
        const nivel_riesgo = this.nivelRiesgoActual()!;

        if (this.modoEdicion) {
            this.formSubmit.emit({ ...raw, nivel_riesgo } as PlanPsbFormValue);
        } else {
            this.formSubmit.emit({ ...raw, nivel_riesgo, tipoAlimentoId } as PlanPsbFormValue);
        }
    }

    onCancel() { this.cancel.emit(); }
}
