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
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';
import { FuenteAguaService } from '@/app/features/agua/fuente-agua/services/fuente-agua.service';
import { FuenteAgua } from '@/app/features/agua/fuente-agua/models/fuente-agua.interface';

@Component({
    selector: 'app-tanque-almacenamiento-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule, SelectModule, CheckboxModule],
    templateUrl: './tanque-almacenamiento-form.component.html',
    styleUrls: ['./tanque-almacenamiento-form.component.scss'],
})
export class TanqueAlmacenamientoFormComponent implements OnInit {
    private fuenteAguaService = inject(FuenteAguaService);
    @Input() tanqueAlmacenamiento?: TanqueAlmacenamiento;
    @Input() saving = false;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    fuenteAguaItems: FuenteAgua[] = [];
    model: any = {};

    ngOnInit() {
        this.fuenteAguaService.getAll().subscribe((items: any[]) => this.fuenteAguaItems = items);
        if (this.tanqueAlmacenamiento) {
            this.model = { ...this.tanqueAlmacenamiento };
            if (this.tanqueAlmacenamiento.fechaUltimoLavado) this.model.fechaUltimoLavado = new Date(this.tanqueAlmacenamiento.fechaUltimoLavado);
        } else {
            this.model = {};
        }
    }

    onSubmit() {
        const data = { ...this.model };
        // Convertir fechas a ISO string
        if (data.fechaUltimoLavado instanceof Date) data.fechaUltimoLavado = data.fechaUltimoLavado.toISOString();
        this.formSubmit.emit(data);
    }

    onCancel() { this.cancel.emit(); }
}