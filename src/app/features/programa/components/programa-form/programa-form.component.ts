import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { Programa, TipoPrograma, FrecuenciaPrograma } from '../../models/programa.interface';

interface ProgramaFormModel { tipo: TipoPrograma | null; nombre: string; responsable: string; frecuencia: FrecuenciaPrograma | null; descripcion: string; }

@Component({
    selector: 'app-programa-form',
    standalone: true,
    imports: [FormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule],
    templateUrl: './programa-form.component.html',
    styleUrls: ['./programa-form.component.scss'],
})
export class ProgramaFormComponent implements OnInit {
    @Input() programa?: Programa;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<ProgramaFormModel>();
    @Output() cancel = new EventEmitter<void>();

    readonly tipoOptions = [
        { label: 'Agua', value: 'agua' as TipoPrograma },
        { label: 'Limpieza', value: 'limpieza' as TipoPrograma },
        { label: 'Plagas', value: 'plagas' as TipoPrograma },
        { label: 'Residuos', value: 'residuos' as TipoPrograma },
    ];
    readonly frecuenciaOptions = [
        { label: 'Diario', value: 'diario' as FrecuenciaPrograma },
        { label: 'Semanal', value: 'semanal' as FrecuenciaPrograma },
        { label: 'Quincenal', value: 'quincenal' as FrecuenciaPrograma },
        { label: 'Mensual', value: 'mensual' as FrecuenciaPrograma },
        { label: 'Trimestral', value: 'trimestral' as FrecuenciaPrograma },
        { label: 'Semestral', value: 'semestral' as FrecuenciaPrograma },
        { label: 'Anual', value: 'anual' as FrecuenciaPrograma },
    ];
    model: ProgramaFormModel = { tipo: null, nombre: '', responsable: '', frecuencia: null, descripcion: '' };
    submitted = false;

    ngOnInit() {
        if (this.programa) {
            this.model = { tipo: this.programa.tipo, nombre: this.programa.nombre, responsable: this.programa.responsable, frecuencia: this.programa.frecuencia, descripcion: this.programa.descripcion || '' };
        }
    }
    onSubmit() {
        this.submitted = true;
        if (!this.model.tipo || !this.model.nombre || !this.model.responsable || !this.model.frecuencia) return;
        this.formSubmit.emit(this.model);
    }
    onCancel() { this.cancel.emit(); }
}
