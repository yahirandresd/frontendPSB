import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { PasoLimpiezaPq } from '../../models/paso-limpieza-pq.interface';
import { CreatePasoLimpiezaPqDto, ConcentracionUnidad } from '../../models/create-paso-limpieza-pq.dto';
import { UpdatePasoLimpiezaPqDto } from '../../models/update-paso-limpieza-pq.dto';

@Component({
    selector: 'app-paso-limpieza-pq-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, SelectModule],
    templateUrl: './paso-limpieza-pq-form.component.html',
    styleUrls: ['./paso-limpieza-pq-form.component.scss']
})
export class PasoLimpiezaPqFormComponent implements OnInit {
    @Input() pq?: PasoLimpiezaPq;
    @Input() pasoLimpiezaId!: string;
    @Input() productoQuimicoId!: string;
    @Output() formSubmit = new EventEmitter<CreatePasoLimpiezaPqDto | UpdatePasoLimpiezaPqDto>();

    private fb = inject(FormBuilder);

    unidadOptions: { label: string; value: ConcentracionUnidad }[] = [
        { label: 'ppm',  value: 'ppm'  },
        { label: '%',    value: '%'    },
        { label: 'mL/L', value: 'mL/L' },
    ];

    form = this.fb.group({
        concentracionValor:  [null as number | null, [Validators.required, Validators.min(0)]],
        concentracionUnidad: [null as ConcentracionUnidad | null, Validators.required],
        tiempoContactoMin:   [null as number | null, [Validators.required, Validators.min(1)]],
    });

    ngOnInit(): void {
        if (this.pq) {
            this.form.patchValue({
                concentracionValor:  this.pq.concentracionValor,
                concentracionUnidad: this.pq.concentracionUnidad,
                tiempoContactoMin:   this.pq.tiempoContactoMin,
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.pq) {
            const dto: UpdatePasoLimpiezaPqDto = {
                concentracionValor:  raw.concentracionValor  ?? undefined,
                concentracionUnidad: raw.concentracionUnidad ?? undefined,
                tiempoContactoMin:   raw.tiempoContactoMin   ?? undefined,
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreatePasoLimpiezaPqDto = {
                pasoLimpiezaId:      this.pasoLimpiezaId,
                productoQuimicoId:   this.productoQuimicoId,
                concentracionValor:  raw.concentracionValor!,
                concentracionUnidad: raw.concentracionUnidad!,
                tiempoContactoMin:   raw.tiempoContactoMin!,
            };
            this.formSubmit.emit(dto);
        }
    }
}
