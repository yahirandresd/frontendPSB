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
import { RegistroAgua } from '../../models/registro-agua.interface';
import { ProgramaAguaService } from '@/app/features/agua/programa-agua/services/programa-agua.service';
import { ProgramaAgua } from '@/app/features/agua/programa-agua/models/programa-agua.interface';

@Component({
    selector: 'app-registro-agua-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule],
    templateUrl: './registro-agua-form.component.html',
    styleUrls: ['./registro-agua-form.component.scss'],
})
export class RegistroAguaFormComponent implements OnInit {
    private programaAguaService = inject(ProgramaAguaService);
    @Input() registroAgua?: RegistroAgua;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    programaAguaItems: ProgramaAgua[] = [];
    tipoActividadOptions = [{"label":"Control Potabilidad","value":"control_potabilidad"},{"label":"Análisis Laboratorio","value":"analisis_laboratorio"},{"label":"Mantenimiento Lavado","value":"mantenimiento_lavado"},{"label":"Acción Correctiva","value":"accion_correctiva"}];
    resultadoGeneralOptions = [{"label":"Conforme","value":"conforme"},{"label":"No Conforme","value":"no_conforme"},{"label":"En Proceso","value":"en_proceso"}];
    model: any = {};

    ngOnInit() {
        this.programaAguaService.getAll().subscribe((items: any[]) => this.programaAguaItems = items);
        if (this.registroAgua) {
            this.model = { ...this.registroAgua };
        } else {
            this.model = {};
        }
    }

    onSubmit() {
        const data = { ...this.model };

        this.formSubmit.emit(data);
    }

    onCancel() { this.cancel.emit(); }
}