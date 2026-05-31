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
import { MantenimientoLavado } from '../../models/mantenimiento-lavado.interface';
import { FuenteAguaService } from '@/app/features/agua/fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '@/app/features/agua/fuente-agua/models/fuente-agua.interface';

@Component({
    selector: 'app-mantenimiento-lavado-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule, FileUploadModule],
    templateUrl: './mantenimiento-lavado-form.component.html',
    styleUrls: ['./mantenimiento-lavado-form.component.scss'],
})
export class MantenimientoLavadoFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() mantenimientoLavado?: MantenimientoLavado;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    estadoOptions = [{"label":"Programado","value":"programado"},{"label":"En Proceso","value":"en_proceso"},{"label":"Completado","value":"completado"},{"label":"Cancelado","value":"cancelado"}];
    tipoLimpiezaOptions = [{"label":"Lavado Interno","value":"lavado_interno"},{"label":"Lavado Externo","value":"lavado_externo"},{"label":"Desinfección","value":"desinfeccion"},{"label":"Lavado General","value":"lavado_general"},{"label":"Otro","value":"otro"}];
    model: any = {};
    private initialModel = '';
    today = new Date();
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuenteAguaItems = items);
        if (this.mantenimientoLavado) {
            this.model = { ...this.mantenimientoLavado };
            if (this.mantenimientoLavado.fechaProgramada) this.model.fechaProgramada = new Date(this.mantenimientoLavado.fechaProgramada);
            if (this.mantenimientoLavado.fechaEjecucion) this.model.fechaEjecucion = new Date(this.mantenimientoLavado.fechaEjecucion);
            if (this.mantenimientoLavado.proximaLimpieza) this.model.proximaLimpieza = new Date(this.mantenimientoLavado.proximaLimpieza);
        } else {
            this.model = {};
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['mantenimientoLavado'] && this.mantenimientoLavado) {
            this.model = { ...this.mantenimientoLavado };
            if (this.mantenimientoLavado.fechaProgramada) this.model.fechaProgramada = new Date(this.mantenimientoLavado.fechaProgramada);
            if (this.mantenimientoLavado.fechaEjecucion) this.model.fechaEjecucion = new Date(this.mantenimientoLavado.fechaEjecucion);
            if (this.mantenimientoLavado.proximaLimpieza) this.model.proximaLimpieza = new Date(this.mantenimientoLavado.proximaLimpieza);
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        const { fuenteAguaId, registroAguaId, fechaProgramada, fechaEjecucion, metodoLimpieza, observaciones, estado, evidenciaFoto, tipoLimpieza, productoUtilizado, concentracionProducto, tiempoContacto, volumenAgua, proceso, responsable, proximaLimpieza, cumple } = this.model;
        if (!fuenteAguaId || !fechaProgramada || !metodoLimpieza) return;
        const data = {
            fuenteAguaId, registroAguaId, metodoLimpieza, observaciones, estado, evidenciaFoto, tipoLimpieza, productoUtilizado, concentracionProducto, tiempoContacto, volumenAgua, proceso, responsable, cumple,
            fechaProgramada: fechaProgramada instanceof Date ? fechaProgramada.toISOString() : fechaProgramada,
            fechaEjecucion: fechaEjecucion instanceof Date ? fechaEjecucion.toISOString() : fechaEjecucion,
            proximaLimpieza: proximaLimpieza instanceof Date ? proximaLimpieza.toISOString() : proximaLimpieza,
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