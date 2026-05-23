import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Empresa } from '../../../empresa/models/empresa.interface';

@Component({
    selector: 'app-step-confirmacion',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './step-confirmacion.component.html',
    styleUrls: ['./step-confirmacion.component.scss']
})
export class StepConfirmacionComponent implements OnInit {
    @Output() back = new EventEmitter<void>();

    private router = inject(Router);
    private messageService = inject(MessageService);
    private wizardService = inject(WizardConfiguracionService);
    private empresaService = inject(EmpresaService);

    empresa: Partial<Empresa> = {};
    creando = false;

    ngOnInit(): void {
        this.empresa = this.wizardService.getSnapshot().empresa;
    }

    async onCrear(): Promise<void> {
        if (this.creando) return;
        this.creando = true;

        try {
            const { empresa } = this.wizardService.getSnapshot();

            await firstValueFrom(
                this.empresaService.create({
                    nombre: empresa.nombre!,
                    nit: empresa.nit!,
                    tipo_negocio: empresa.tipo_negocio!,
                    direccion: empresa.direccion!,
                    representante: empresa.representante!,
                    registro_sanitario_funcionamiento: empresa.registro_sanitario_funcionamiento,
                    resolucion_invima: empresa.resolucion_invima
                })
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Empresa registrada',
                detail: 'La empresa se registró correctamente.'
            });

            this.wizardService.resetWizard();
            this.router.navigate(['/dashboard']);
        } catch {
            this.messageService.add({
                severity: 'error',
                summary: 'Error al registrar',
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
