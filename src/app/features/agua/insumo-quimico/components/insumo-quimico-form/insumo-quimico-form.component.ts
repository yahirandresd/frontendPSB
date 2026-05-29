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
import { InsumoQuimico } from '../../models/insumo-quimico.interface';

@Component({
    selector: 'app-insumo-quimico-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule],
    templateUrl: './insumo-quimico-form.component.html',
    styleUrls: ['./insumo-quimico-form.component.scss'],
})
export class InsumoQuimicoFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    @Input() insumoQuimico?: InsumoQuimico;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    unidadOptions = [{"label":"Litros","value":"L"},{"label":"Mililitros","value":"mL"},{"label":"Kilogramos","value":"kg"},{"label":"Gramos","value":"g"},{"label":"Unidades","value":"unidades"}];
    model: any = {};
    private initialModel = '';
    today = new Date();

    ngOnInit() {
        if (this.insumoQuimico) {
            this.model = { ...this.insumoQuimico };
            if (this.insumoQuimico.fechaVencimiento) this.model.fechaVencimiento = new Date(this.insumoQuimico.fechaVencimiento);
        } else {
            this.model = {};
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['insumoQuimico'] && this.insumoQuimico) {
            this.model = { ...this.insumoQuimico };
            if (this.insumoQuimico.fechaVencimiento) this.model.fechaVencimiento = new Date(this.insumoQuimico.fechaVencimiento);
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        const { mantenimientoId, nombre } = this.model;
        if (!mantenimientoId || !nombre) return;
        const data = { ...this.model };
        if (data.fechaVencimiento instanceof Date) data.fechaVencimiento = data.fechaVencimiento.toISOString();
        this.formSubmit.emit(data);
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    markAsPristine(): void { this.initialModel = JSON.stringify(this.model); }

    onCancel() { this.markAsPristine(); this.cancel.emit(); }
}