import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { TipoAlimentoService } from '../../../tipo-alimento/services/tipo-alimento.service';
import { PlanPsbService } from '../../services/plan-psb.service';
import { Empresa } from '../../../empresa/models/empresa.interface';
import { TipoAlimento, NivelRiesgo } from '../../../tipo-alimento/models/tipo-alimento.interface';
import { PlanPSB } from '../../models/plan-psb.interface';

@Component({
    selector: 'app-step-confirmacion',
    standalone: true,
    imports: [TagModule, ButtonModule],
    templateUrl: './step-confirmacion.component.html',
    styleUrls: ['./step-confirmacion.component.scss']
})
export class StepConfirmacionComponent implements OnInit {
    @Output() back = new EventEmitter<void>();

    private router = inject(Router);
    private messageService = inject(MessageService);
    wizardService = inject(WizardConfiguracionService);
    private empresaService = inject(EmpresaService);
    private tipoAlimentoService = inject(TipoAlimentoService);
    private planPsbService = inject(PlanPsbService);

    empresa: Partial<Empresa> = {};
    tiposAlimento: Partial<TipoAlimento>[] = [];
    planPsb: Partial<PlanPSB> = {};
    tipoAlimentoSeleccionado: Partial<TipoAlimento> | null = null;
    creando = false;

    readonly programas = [
        { icono: 'pi-sparkles', nombre: 'Limpieza y Desinfección' },
        { icono: 'pi-bug',      nombre: 'Control de Plagas' },
        { icono: 'pi-tint',     nombre: 'Gestión del Agua' },
        { icono: 'pi-inbox',    nombre: 'Manejo de Residuos' }
    ];

    ngOnInit(): void {
        const state = this.wizardService.getSnapshot();
        this.empresa = state.empresa;
        this.tiposAlimento = [...state.tiposAlimento];
        this.planPsb = state.planPsb;

        const idx = parseInt(state.planPsb.tipo_alimento_id as string);
        this.tipoAlimentoSeleccionado = this.tiposAlimento[idx] ?? null;
    }

    getSeverity(nivel: NivelRiesgo | undefined): 'danger' | 'warn' | 'success' | 'info' {
        if (!nivel) return 'info';
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = {
            ALTO: 'danger',
            MEDIO: 'warn',
            BAJO: 'success'
        };
        return map[nivel];
    }

    async onCrear(): Promise<void> {
        if (this.creando) return;
        this.creando = true;

        try {
            const state = this.wizardService.getSnapshot();

            // 1. Crear empresa
            const empresa = await firstValueFrom(
                this.empresaService.create({
                    nombre: state.empresa.nombre!,
                    nit: state.empresa.nit!,
                    tipo_negocio: state.empresa.tipo_negocio!,
                    direccion: state.empresa.direccion!,
                    representante: state.empresa.representante!,
                    registro_sanitario_funcionamiento: state.empresa.registro_sanitario_funcionamiento,
                    resolucion_invima: state.empresa.resolucion_invima
                })
            );

            // 2. Crear todos los tipos de alimento
            const tiposCreados = await Promise.all(
                state.tiposAlimento.map((t) =>
                    firstValueFrom(
                        this.tipoAlimentoService.create({
                            empresa_id: empresa.id,
                            nombre: t.nombre!,
                            nivel_riesgo: t.nivel_riesgo!,
                            descripcion: t.descripcion
                        })
                    )
                )
            );

            // 3. Crear plan PSB con el ID real del tipo seleccionado
            const idx = parseInt(state.planPsb.tipo_alimento_id as string);
            await firstValueFrom(
                this.planPsbService.create({
                    empresa_id: empresa.id,
                    tipo_alimento_id: tiposCreados[idx].id,
                    version: state.planPsb.version!,
                    nivel_riesgo: state.planPsb.nivel_riesgo!,
                    fecha_creacion: state.planPsb.fecha_creacion!
                })
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Plan PSB creado',
                detail: 'El plan se creó exitosamente con los 4 programas obligatorios.'
            });

            this.wizardService.resetWizard();
            this.router.navigate(['/dashboard']);
        } catch {
            this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el plan',
                detail: 'Ocurrió un error. Verifica tu conexión e intenta nuevamente.',
                sticky: true
            });
        } finally {
            this.creando = false;
        }
    }

    onBack(): void {
        this.back.emit();
    }
}
