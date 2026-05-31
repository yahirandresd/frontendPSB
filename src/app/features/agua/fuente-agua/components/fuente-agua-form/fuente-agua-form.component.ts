import { Component, EventEmitter, Input, OnInit, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { HasUnsavedChanges } from '@/app/features/shared/interfaces/has-unsaved-changes.interface';
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
import { FuenteAgua } from '../../models/fuente-agua.interface';
import { ProgramaAguaService } from '@/app/features/agua/programa-agua/services/programa-agua.service';
import { ProgramaAgua } from '@/app/features/agua/programa-agua/models/programa-agua.interface';

@Component({
    selector: 'app-fuente-agua-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule, FileUploadModule],
    templateUrl: './fuente-agua-form.component.html',
    styleUrls: ['./fuente-agua-form.component.scss'],
})
export class FuenteAguaFormComponent implements OnInit, OnChanges, HasUnsavedChanges {
    private programaAguaService = inject(ProgramaAguaService);
    @Input() fuenteAgua?: FuenteAgua;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    programaAguaItems: ProgramaAgua[] = [];
    tipoOptions = [{"label":"Pozo","value":"pozo"},{"label":"Red Pública","value":"red_publica"},{"label":"Río","value":"rio"},{"label":"Carro Tanque","value":"carro_tanque"},{"label":"Otro","value":"otro"}];
    estadoOptions = [{"label":"Activo","value":"activo"},{"label":"Inactivo","value":"inactivo"}];
    departamentoOptions = [{"label":"Amazonas","value":"amazonas"},{"label":"Antioquia","value":"antioquia"},{"label":"Arauca","value":"arauca"},{"label":"Atlántico","value":"atlantico"},{"label":"Bolívar","value":"bolivar"},{"label":"Boyacá","value":"boyaca"},{"label":"Caldas","value":"caldas"},{"label":"Caquetá","value":"caqueta"},{"label":"Casanare","value":"casanare"},{"label":"Cauca","value":"cauca"},{"label":"Cesar","value":"cesar"},{"label":"Chocó","value":"choco"},{"label":"Córdoba","value":"cordoba"},{"label":"Cundinamarca","value":"cundinamarca"},{"label":"Guainía","value":"guainia"},{"label":"Guaviare","value":"guaviare"},{"label":"Huila","value":"huila"},{"label":"La Guajira","value":"la_guajira"},{"label":"Magdalena","value":"magdalena"},{"label":"Meta","value":"meta"},{"label":"Nariño","value":"narnio"},{"label":"Norte de Santander","value":"norte_santander"},{"label":"Putumayo","value":"putumayo"},{"label":"Quindío","value":"quindio"},{"label":"Risaralda","value":"risaralda"},{"label":"San Andrés y Providencia","value":"san_andres"},{"label":"Santander","value":"santander"},{"label":"Sucre","value":"sucre"},{"label":"Tolima","value":"tolima"},{"label":"Valle del Cauca","value":"valle"},{"label":"Vaupés","value":"vaupes"},{"label":"Vichada","value":"vichada"}];
    model: any = {};
    private initialModel = '';
    uploadUrl = `${environment.apiUrl}/uploads`;

    ngOnInit() {
        this.programaAguaService.getAll().subscribe((items: any[]) => this.programaAguaItems = items);
        if (this.fuenteAgua) {
            this.model = { ...this.fuenteAgua };
        } else {
            this.model = {};
        }
        this.initialModel = JSON.stringify(this.model);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['fuenteAgua'] && this.fuenteAgua) {
            this.model = { ...this.fuenteAgua };
        }
        this.initialModel = JSON.stringify(this.model);
    }

    onSubmit() {
        const { programaAguaId, nombre, tipo, proveedor, ubicacion, requiereTanque, estado, municipio, departamento, concesion, tratamiento, evidenciaFoto } = this.model;
        if (!programaAguaId || !nombre || !tipo) return;
        const data = { programaAguaId, nombre, tipo, proveedor, ubicacion, requiereTanque, estado, municipio, departamento, concesion, tratamiento, evidenciaFoto };

        this.formSubmit.emit(data);
    }

    onUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.model.evidenciaFoto = response.url;
    }

    hasUnsavedChanges(): boolean { return JSON.stringify(this.model) !== this.initialModel; }

    markAsPristine(): void { this.initialModel = JSON.stringify(this.model); }

    onCancel() { this.markAsPristine(); this.cancel.emit(); }
}