import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
    selector: 'app-accion-correctiva-agua-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule, FileUploadModule],
    templateUrl: './accion-correctiva-agua-form.component.html',
    styleUrls: ['./accion-correctiva-agua-form.component.scss'],
})
export class AccionCorrectivaAguaFormComponent implements OnInit {
    @Input() accionCorrectivaAgua?: AccionCorrectivaAgua;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    estadoOptions = [{"label":"Pendiente","value":"pendiente"},{"label":"En Proceso","value":"en_proceso"},{"label":"Completada","value":"completada"},{"label":"Cancelada","value":"cancelada"}];
    model: any = {};
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        if (this.accionCorrectivaAgua) {
            this.model = { ...this.accionCorrectivaAgua };
            if (this.accionCorrectivaAgua.fecha) this.model.fecha = new Date(this.accionCorrectivaAgua.fecha);
        } else {
            this.model = {};
        }
    }

    onSubmit() {
        const data = { ...this.model };
        if (data.fecha instanceof Date) data.fecha = data.fecha.toISOString();
        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.evidenciaFoto = response.url;
    }

    onCancel() { this.cancel.emit(); }
}