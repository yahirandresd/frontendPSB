import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '@/environments/environment';
import { ControlPotabilidad } from '../../models/control-potabilidad.interface';
import { FuenteAguaService } from '../../../fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '../../../fuente-agua/models/fuente-agua.interface';

@Component({
    selector: 'app-control-potabilidad-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, FileUploadModule],
    templateUrl: './control-potabilidad-form.component.html',
    styleUrls: ['./control-potabilidad-form.component.scss'],
})
export class ControlPotabilidadFormComponent implements OnInit {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() controlPotabilidad?: ControlPotabilidad;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuentesAgua: FuenteAgua[] = [];
    model: any = {};
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuentesAgua = items);
        if (this.controlPotabilidad) {
            this.model = { ...this.controlPotabilidad, fechaHora: new Date(this.controlPotabilidad.fechaHora) };
        } else {
            this.model = { fechaHora: new Date() };
        }
    }

    onSubmit() {
        const data = {
            ...this.model,
            fechaHora: this.model.fechaHora instanceof Date ? this.model.fechaHora.toISOString() : this.model.fechaHora,
        };
        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.evidenciaFoto = response.url;
    }

    onCancel() { this.cancel.emit(); }
}