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
export class MantenimientoLavadoFormComponent implements OnInit {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() mantenimientoLavado?: MantenimientoLavado;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    estadoOptions = [{"label":"Programado","value":"programado"},{"label":"En Proceso","value":"en_proceso"},{"label":"Completado","value":"completado"},{"label":"Cancelado","value":"cancelado"}];
    model: any = {};
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuenteAguaItems = items);
        if (this.mantenimientoLavado) {
            this.model = { ...this.mantenimientoLavado };
            if (this.mantenimientoLavado.fechaProgramada) this.model.fechaProgramada = new Date(this.mantenimientoLavado.fechaProgramada);
            if (this.mantenimientoLavado.fechaEjecucion) this.model.fechaEjecucion = new Date(this.mantenimientoLavado.fechaEjecucion);
        } else {
            this.model = {};
        }
    }

    onSubmit() {
        const data = { ...this.model };
        if (data.fechaProgramada instanceof Date) data.fechaProgramada = data.fechaProgramada.toISOString();
        if (data.fechaEjecucion instanceof Date) data.fechaEjecucion = data.fechaEjecucion.toISOString();
        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.evidenciaFoto = response.url;
    }

    onCancel() { this.cancel.emit(); }
}