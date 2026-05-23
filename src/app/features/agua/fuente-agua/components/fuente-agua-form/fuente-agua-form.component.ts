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
import { FuenteAgua } from '../../models/fuente-agua.interface';
import { ProgramaAguaService } from '@/app/features/agua/programa-agua/services/programa-agua.service';
import { ProgramaAgua } from '@/app/features/agua/programa-agua/models/programa-agua.interface';

@Component({
    selector: 'app-fuente-agua-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule],
    templateUrl: './fuente-agua-form.component.html',
    styleUrls: ['./fuente-agua-form.component.scss'],
})
export class FuenteAguaFormComponent implements OnInit {
    private programaAguaService = inject(ProgramaAguaService);
    @Input() fuenteAgua?: FuenteAgua;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    programaAguaItems: ProgramaAgua[] = [];
    tipoOptions = [{"label":"Pozo","value":"pozo"},{"label":"Red Pública","value":"red_publica"},{"label":"Río","value":"rio"},{"label":"Carro Tanque","value":"carro_tanque"},{"label":"Otro","value":"otro"}];
    estadoOptions = [{"label":"Activo","value":"activo"},{"label":"Inactivo","value":"inactivo"}];
    model: any = {};

    ngOnInit() {
        this.programaAguaService.getAll().subscribe((items: any[]) => this.programaAguaItems = items);
        if (this.fuenteAgua) {
            this.model = { ...this.fuenteAgua };
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