import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '@/environments/environment';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';
import { FuenteAguaService } from '@/app/features/agua/fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '@/app/features/agua/fuente-agua/models/fuente-agua.interface';

@Component({
    selector: 'app-accion-correctiva-agua-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule, FileUploadModule],
    templateUrl: './accion-correctiva-agua-form.component.html',
    styleUrls: ['./accion-correctiva-agua-form.component.scss'],
})
export class AccionCorrectivaAguaFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() accionCorrectivaAgua?: AccionCorrectivaAgua;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    estadoOptions = [{"label":"Pendiente","value":"pendiente"},{"label":"En Proceso","value":"en_proceso"},{"label":"Completada","value":"completada"},{"label":"Cancelada","value":"cancelada"}];
    origenOptions = [{"label":"Control Diario","value":"control_diario"},{"label":"Análisis Laboratorio","value":"analisis_laboratorio"},{"label":"Mantenimiento","value":"mantenimiento"},{"label":"Auditoría","value":"auditoria"},{"label":"Otro","value":"otro"}];
    model: any = {};
    private initialModel = '';
    today = new Date();
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe(items => this.fuenteAguaItems = items);
        if (this.accionCorrectivaAgua) {
            this.model = { ...this.accionCorrectivaAgua };
            if (this.accionCorrectivaAgua.fecha) this.model.fecha = new Date(this.accionCorrectivaAgua.fecha);
            if (this.accionCorrectivaAgua.fechaLimite) this.model.fechaLimite = new Date(this.accionCorrectivaAgua.fechaLimite);
        } else {
            this.model = {};
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['accionCorrectivaAgua'] && this.accionCorrectivaAgua) {
            this.model = { ...this.accionCorrectivaAgua };
            if (this.accionCorrectivaAgua.fecha) this.model.fecha = new Date(this.accionCorrectivaAgua.fecha);
            if (this.accionCorrectivaAgua.fechaLimite) this.model.fechaLimite = new Date(this.accionCorrectivaAgua.fechaLimite);
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        const { fuenteAguaId, registroAguaId, descripcionDesviacion, medidaTomada, resultadoVerificacion, fecha, responsable, estado, evidenciaFoto, parametroIncumplido, valorMedido, valorEsperado, causaRaiz, accionInmediata, accionCorrectiva, fechaLimite, verificacionEficacia, eficaz, origen } = this.model;
        if (!fuenteAguaId || !descripcionDesviacion || !medidaTomada || !fecha || !responsable) return;
        const data = {
            fuenteAguaId, registroAguaId, descripcionDesviacion, medidaTomada, resultadoVerificacion, responsable, estado, evidenciaFoto, parametroIncumplido, valorMedido, valorEsperado, causaRaiz, accionInmediata, accionCorrectiva, verificacionEficacia, eficaz, origen,
            fecha: fecha instanceof Date ? fecha.toISOString() : fecha,
            fechaLimite: fechaLimite instanceof Date ? fechaLimite.toISOString() : fechaLimite,
        };
        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.evidenciaFoto = response.url;
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    markAsPristine(): void { this.initialModel = JSON.stringify(this.model); }

    onCancel() { this.markAsPristine(); this.cancel.emit(); }
}