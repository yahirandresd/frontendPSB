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
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';
import { FuenteAguaService } from '@/app/features/agua/fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '@/app/features/agua/fuente-agua/models/fuente-agua.interface';

@Component({
    selector: 'app-tanque-almacenamiento-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule],
    templateUrl: './tanque-almacenamiento-form.component.html',
    styleUrls: ['./tanque-almacenamiento-form.component.scss'],
})
export class TanqueAlmacenamientoFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() tanqueAlmacenamiento?: TanqueAlmacenamiento;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    tipoOptions = [{"label":"Tanque Plástico","value":"tanque_plastico"},{"label":"Tanque Metálico","value":"tanque_metalico"},{"label":"Tanque Concreto","value":"tanque_concreto"},{"label":"Otro","value":"otro"}];
    model: any = {};
    private initialModel = '';

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuenteAguaItems = items);
        if (this.tanqueAlmacenamiento) {
            this.model = { ...this.tanqueAlmacenamiento };
            if (this.tanqueAlmacenamiento.fechaUltimoLavado) this.model.fechaUltimoLavado = new Date(this.tanqueAlmacenamiento.fechaUltimoLavado);
            if (this.tanqueAlmacenamiento.proximaLimpieza) this.model.proximaLimpieza = new Date(this.tanqueAlmacenamiento.proximaLimpieza);
        } else {
            this.model = {};
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tanqueAlmacenamiento'] && this.tanqueAlmacenamiento) {
            this.model = { ...this.tanqueAlmacenamiento };
            if (this.tanqueAlmacenamiento.fechaUltimoLavado) this.model.fechaUltimoLavado = new Date(this.tanqueAlmacenamiento.fechaUltimoLavado);
            if (this.tanqueAlmacenamiento.proximaLimpieza) this.model.proximaLimpieza = new Date(this.tanqueAlmacenamiento.proximaLimpieza);
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        const { fuenteAguaId, capacidadLitros, materialGradoAlimenticio } = this.model;
        if (!fuenteAguaId || capacidadLitros === undefined || capacidadLitros === null || !materialGradoAlimenticio) return;
        const data = { ...this.model };
        if (data.fechaUltimoLavado instanceof Date) data.fechaUltimoLavado = data.fechaUltimoLavado.toISOString();
        if (data.proximaLimpieza instanceof Date) data.proximaLimpieza = data.proximaLimpieza.toISOString();
        this.formSubmit.emit(data);
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    onCancel() { this.cancel.emit(); }
}