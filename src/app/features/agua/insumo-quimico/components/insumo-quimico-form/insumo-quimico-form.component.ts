import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
export class InsumoQuimicoFormComponent implements OnInit {
    @Input() insumoQuimico?: InsumoQuimico;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    model: any = {};

    ngOnInit() {
        if (this.insumoQuimico) {
            this.model = { ...this.insumoQuimico };
            if (this.insumoQuimico.fechaVencimiento) this.model.fechaVencimiento = new Date(this.insumoQuimico.fechaVencimiento);
        } else {
            this.model = {};
        }
    }

    onSubmit() {
        const data = { ...this.model };
        // Convertir fechas a ISO string
        if (data.fechaVencimiento instanceof Date) data.fechaVencimiento = data.fechaVencimiento.toISOString();
        this.formSubmit.emit(data);
    }

    onCancel() { this.cancel.emit(); }
}