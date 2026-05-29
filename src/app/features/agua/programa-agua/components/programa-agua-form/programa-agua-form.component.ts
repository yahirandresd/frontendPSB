import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
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
export class ProgramaAguaFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    @Input() programaAgua?: ProgramaAgua;
    @Input() saving = false;

    @Output() formSubmit = new EventEmitter<ProgramaAguaFormModel>();
    @Output() cancel = new EventEmitter<void>();

    model: ProgramaAguaFormModel = {
        objetivo: '',
        alcance: '',
        procedimientoGeneral: '',
    };
    private initialModel = '';

    ngOnInit() {
        if (this.programaAgua) {
            this.model = {
                objetivo: this.programaAgua.objetivo,
                alcance: this.programaAgua.alcance,
                procedimientoGeneral: this.programaAgua.procedimientoGeneral,
            };
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['programaAgua'] && this.programaAgua) {
            this.model = {
                objetivo: this.programaAgua.objetivo,
                alcance: this.programaAgua.alcance,
                procedimientoGeneral: this.programaAgua.procedimientoGeneral,
            };
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        if (!this.model.objetivo || !this.model.alcance || !this.model.procedimientoGeneral) return;
        this.formSubmit.emit(this.model);
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    markAsPristine(): void { this.initialModel = JSON.stringify(this.model); }

    onCancel() { this.markAsPristine(); this.cancel.emit(); }
}
