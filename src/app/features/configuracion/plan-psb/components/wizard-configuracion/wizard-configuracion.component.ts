import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { StepEmpresaComponent } from '../step-empresa/step-empresa.component';
import { StepConfirmacionComponent } from '../step-confirmacion/step-confirmacion.component';

@Component({
    selector: 'app-wizard-configuracion',
    standalone: true,
    imports: [AsyncPipe, StepsModule, StepEmpresaComponent, StepConfirmacionComponent],
    templateUrl: './wizard-configuracion.component.html',
    styleUrls: ['./wizard-configuracion.component.scss']
})
export class WizardConfiguracionComponent {
    wizardService = inject(WizardConfiguracionService);
    state$ = this.wizardService.getState();

    pasos: MenuItem[] = [
        { label: 'Empresa' },
        { label: 'Confirmación' }
    ];

    onNext(): void {
        const paso = this.wizardService.getSnapshot().pasoActual;
        this.wizardService.setPasoActual(paso + 1);
    }

    onBack(): void {
        const paso = this.wizardService.getSnapshot().pasoActual;
        this.wizardService.setPasoActual(paso - 1);
    }
}
