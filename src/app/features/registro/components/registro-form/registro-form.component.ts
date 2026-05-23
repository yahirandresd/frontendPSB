import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Registro } from '../../models/registro.interface';

interface RegistroFormModel { fecha: string; horaInicio: string; horaFin: string; observaciones: string; }

@Component({
    selector: 'app-registro-form',
    standalone: true,
    imports: [FormsModule, ButtonModule, InputTextModule, TextareaModule],
    templateUrl: './registro-form.component.html',
    styleUrls: ['./registro-form.component.scss'],
})
export class RegistroFormComponent implements OnInit {
    @Input() registro?: Registro;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<RegistroFormModel>();
    @Output() cancel = new EventEmitter<void>();

    model: RegistroFormModel = { fecha: '', horaInicio: '', horaFin: '', observaciones: '' };
    submitted = false;

    ngOnInit() {
        if (this.registro) {
            this.model = { fecha: this.registro.fecha?.toString().slice(0, 10) || '', horaInicio: this.registro.horaInicio || '', horaFin: this.registro.horaFin || '', observaciones: this.registro.observaciones || '' };
        }
    }
    onSubmit() {
        this.submitted = true;
        if (!this.model.fecha) return;
        this.formSubmit.emit(this.model);
    }
    onCancel() { this.cancel.emit(); }
}
