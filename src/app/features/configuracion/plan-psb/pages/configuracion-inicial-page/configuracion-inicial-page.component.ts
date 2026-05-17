import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { WizardConfiguracionService } from '../../services/wizard-configuracion.service';
import { WizardConfiguracionComponent } from '../../components/wizard-configuracion/wizard-configuracion.component';

@Component({
    selector: 'app-configuracion-inicial-page',
    standalone: true,
    imports: [ToastModule, WizardConfiguracionComponent],
    templateUrl: './configuracion-inicial-page.component.html',
    styleUrls: ['./configuracion-inicial-page.component.scss'],
    providers: [WizardConfiguracionService, MessageService]
})
export class ConfiguracionInicialPageComponent {}
