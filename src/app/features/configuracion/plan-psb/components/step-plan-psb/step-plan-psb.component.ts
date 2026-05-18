import { Component, EventEmitter, OnInit, OnDestroy, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { TipoAlimento, NivelRiesgo } from '../../../tipo-alimento/models/tipo-alimento.interface';

@Component({
    selector: 'app-step-plan-psb',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, TagModule, ButtonModule],
    templateUrl: './step-plan-psb.component.html',
    styleUrls: ['./step-plan-psb.component.scss']
})
export class StepPlanPsbComponent implements OnInit, OnDestroy {
    @Output() next = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    wizardService = inject(WizardConfiguracionService);

    tiposAlimento: Partial<TipoAlimento>[] = [];
    tiposAlimentoOptions: { label: string; value: string }[] = [];
    nivelRiesgoActual: NivelRiesgo | null = null;

    readonly programas = [
        { icono: 'pi-sparkles', nombre: 'Limpieza y Desinfección' },
        { icono: 'pi-bug',      nombre: 'Control de Plagas' },
        { icono: 'pi-tint',     nombre: 'Gestión del Agua' },
        { icono: 'pi-inbox',    nombre: 'Manejo de Residuos' }
    ];

    form: FormGroup = this.fb.group({
        tipo_alimento_id: [null, Validators.required],
        version: ['1.0', Validators.required],
        fecha_creacion: [new Date(), Validators.required]
    });

    private sub = new Subscription();

    ngOnInit(): void {
        this.tiposAlimento = [...this.wizardService.getSnapshot().tiposAlimento];
        this.tiposAlimentoOptions = this.tiposAlimento.map((t, i) => ({
            label: t.nombre ?? `Tipo ${i + 1}`,
            value: String(i)
        }));

        this.sub.add(
            this.form.get('tipo_alimento_id')!.valueChanges.subscribe((idx: string) => {
                const tipo = this.tiposAlimento[Number(idx)];
                this.nivelRiesgoActual = (tipo?.nivel_riesgo as NivelRiesgo) ?? null;
            })
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
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

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const val = this.form.value;
        this.wizardService.setPlanPsb({
            tipo_alimento_id: val.tipo_alimento_id,
            version: val.version,
            nivel_riesgo: this.nivelRiesgoActual ?? undefined,
            fecha_creacion: (val.fecha_creacion as Date).toISOString().split('T')[0]
        });
        this.next.emit();
    }

    onBack(): void {
        this.back.emit();
    }
}
