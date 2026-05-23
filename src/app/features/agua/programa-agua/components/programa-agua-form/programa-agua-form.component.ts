import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ProgramaAgua } from '../../models/programa-agua.interface';

interface ProgramaAguaFormModel {
    objetivo: string;
    alcance: string;
    procedimientoGeneral: string;
}

@Component({
    selector: 'app-programa-agua-form',
    standalone: true,
    imports: [FormsModule, ButtonModule, TextareaModule],
    templateUrl: './programa-agua-form.component.html',
    styleUrls: ['./programa-agua-form.component.scss'],
})
export class ProgramaAguaFormComponent implements OnInit {
    @Input() programaAgua?: ProgramaAgua;
    @Input() saving = false;

    @Output() formSubmit = new EventEmitter<ProgramaAguaFormModel>();
    @Output() cancel = new EventEmitter<void>();

    model: ProgramaAguaFormModel = {
        objetivo: '',
        alcance: '',
        procedimientoGeneral: '',
    };

    submitted = false;

    ngOnInit() {
        if (this.programaAgua) {
            this.model = {
                objetivo: this.programaAgua.objetivo,
                alcance: this.programaAgua.alcance,
                procedimientoGeneral: this.programaAgua.procedimientoGeneral,
            };
        }
    }

    onSubmit() {
        this.submitted = true;
        if (!this.model.objetivo || !this.model.alcance || !this.model.procedimientoGeneral) return;
        this.formSubmit.emit(this.model);
    }

    onCancel() { this.cancel.emit(); }
}
