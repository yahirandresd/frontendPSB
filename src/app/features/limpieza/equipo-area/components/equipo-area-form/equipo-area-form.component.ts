import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { EquipoArea, EstadoEquipoArea, TipoEquipoArea } from '../../models/equipo-area.interface';
import { CreateEquipoAreaDto } from '../../models/create-equipo-area.dto';
import { UpdateEquipoAreaDto } from '../../models/update-equipo-area.dto';

@Component({
    selector: 'app-equipo-area-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule],
    templateUrl: './equipo-area-form.component.html',
    styleUrls: ['./equipo-area-form.component.scss']
})
export class EquipoAreaFormComponent implements OnInit {
    @Input() equipo?: EquipoArea;
    @Output() formSubmit = new EventEmitter<CreateEquipoAreaDto | UpdateEquipoAreaDto>();

    private fb = inject(FormBuilder);

    tiposEquipoArea: { label: string; value: TipoEquipoArea }[] = [
        { label: 'Área',       value: 'AREA'      },
        { label: 'Equipo',     value: 'EQUIPO'    },
        { label: 'Utensilio',  value: 'UTENSILIO' }
    ];

    estadosEquipoArea: { label: string; value: EstadoEquipoArea }[] = [
        { label: 'Activo',   value: 'ACTIVO'   },
        { label: 'Inactivo', value: 'INACTIVO' }
    ];

    form: FormGroup = this.fb.group({
        empresaId: ['', Validators.required],
        nombre:    ['', Validators.required],
        tipo:      [null, Validators.required],
        estado:    ['ACTIVO']
    });

    get f() { return this.form.controls; }

    ngOnInit(): void {
        if (this.equipo) {
            this.form.patchValue(this.equipo);
            this.f['empresaId'].disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const payload = this.equipo
            ? { nombre: raw.nombre, tipo: raw.tipo, estado: raw.estado } as UpdateEquipoAreaDto
            : { empresaId: raw.empresaId, nombre: raw.nombre, tipo: raw.tipo, estado: raw.estado } as CreateEquipoAreaDto;
        this.formSubmit.emit(payload);
    }
}
