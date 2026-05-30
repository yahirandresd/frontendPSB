import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges, signal } from '@angular/core';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primeng/tabs';
import { environment } from '@/environments/environment';
import { AnalisisLaboratorio } from '../../models/analisis-laboratorio.interface';
import { FuenteAguaService } from '@/app/features/agua/fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '@/app/features/agua/fuente-agua/models/fuente-agua.interface';
import { calcularIRCA, getNivelRiesgoLabel, getNivelRiesgoSeverity, ResultadoIRCA } from '../../utils/irca.calculator';

@Component({
    selector: 'app-analisis-laboratorio-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, DatePickerModule, SelectModule, CheckboxModule, TagModule, FileUploadModule, Tabs, TabList, Tab, TabPanel, TabPanels],
    templateUrl: './analisis-laboratorio-form.component.html',
    styleUrls: ['./analisis-laboratorio-form.component.scss'],
})
export class AnalisisLaboratorioFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() analisisLaboratorio?: AnalisisLaboratorio;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    model: any = {};
    private initialModel = '';
    today = new Date();
    ircaResult = signal<ResultadoIRCA | null>(null);
    getNivelRiesgoLabel = getNivelRiesgoLabel;
    getNivelRiesgoSeverity = getNivelRiesgoSeverity;
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuenteAguaItems = items);
        if (this.analisisLaboratorio) {
            this.model = { ...this.analisisLaboratorio };
            if (this.analisisLaboratorio.fechaMuestreo) this.model.fechaMuestreo = new Date(this.analisisLaboratorio.fechaMuestreo);
            if (this.analisisLaboratorio.fechaEntregaResultado) this.model.fechaEntregaResultado = new Date(this.analisisLaboratorio.fechaEntregaResultado);
        } else {
            this.model = {
                coliformesTotalesPresentes: false,
                eColiPresente: false,
                mesofilos: 0,
            };
        }
        this.initialModel = JSON.stringify(this.model);
        this.recalcularIRCA();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['analisisLaboratorio'] && this.analisisLaboratorio) {
            this.model = { ...this.analisisLaboratorio };
            if (this.analisisLaboratorio.fechaMuestreo) this.model.fechaMuestreo = new Date(this.analisisLaboratorio.fechaMuestreo);
            if (this.analisisLaboratorio.fechaEntregaResultado) this.model.fechaEntregaResultado = new Date(this.analisisLaboratorio.fechaEntregaResultado);
        }
        this.initialModel = JSON.stringify(this.model);
        this.recalcularIRCA();
    }

    recalcularIRCA() {
        const { cloroResidual, ph, turbiedad, colorAparente, coliformesTotalesPresentes, eColiPresente, mesofilos } = this.model;
        if (cloroResidual == null || ph == null || turbiedad == null || colorAparente == null) {
            this.ircaResult.set(null);
            return;
        }
        this.ircaResult.set(calcularIRCA({
            cloroResidual,
            ph,
            turbiedad,
            colorAparente,
            coliformesTotalesPresentes: !!coliformesTotalesPresentes,
            eColiPresente: !!eColiPresente,
            mesofilos: mesofilos ?? 0,
        }));
    }

    onSubmit() {
        const { fuenteAguaId, numeroCertificado, laboratorioCertificado, fechaMuestreo, responsableMuestra, puntoMuestreo, cloroResidual, ph, turbiedad, colorAparente } = this.model;
        if (!fuenteAguaId || !numeroCertificado || !laboratorioCertificado || !fechaMuestreo || !responsableMuestra || !puntoMuestreo) return;
        if (cloroResidual === undefined || cloroResidual === null) return;
        if (ph === undefined || ph === null) return;
        if (turbiedad === undefined || turbiedad === null) return;
        if (colorAparente === undefined || colorAparente === null) return;
        const data = { ...this.model };
        if (data.fechaMuestreo instanceof Date) data.fechaMuestreo = data.fechaMuestreo.toISOString();
        if (data.fechaEntregaResultado instanceof Date) data.fechaEntregaResultado = data.fechaEntregaResultado.toISOString();
        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.fotoEvidencia = response.url;
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    markAsPristine(): void { this.initialModel = JSON.stringify(this.model); }

    onCancel() { this.markAsPristine(); this.cancel.emit(); }
}
