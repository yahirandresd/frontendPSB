import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ChecklistLimpieza, EstadoChecklist } from '../../models/checklist-limpieza.interface';
import { CreateChecklistLimpiezaDto } from '../../models/create-checklist-limpieza.dto';
import { UpdateChecklistLimpiezaDto } from '../../models/update-checklist-limpieza.dto';
import { PasoLimpiezaService } from '@/app/features/limpieza/paso-limpieza/services/paso-limpieza.service';
import { ProductoQuimicoService } from '@/app/features/limpieza/producto-quimico/services/producto-quimico.service';

@Component({
    selector: 'app-checklist-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, CheckboxModule, SelectModule, InputNumberModule, DividerModule],
    templateUrl: './checklist-limpieza-form.component.html',
    styleUrls: ['./checklist-limpieza-form.component.scss']
})
export class ChecklistLimpiezaFormComponent implements OnInit {
    @Input() item?: ChecklistLimpieza;
    @Input() programaId!: string;
    @Input() registroLimpiezaId!: string;
    @Output() formSubmit = new EventEmitter<CreateChecklistLimpiezaDto | UpdateChecklistLimpiezaDto>();
    @Output() cancelar = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private pasoService = inject(PasoLimpiezaService);
    private productoService = inject(ProductoQuimicoService);

    pasos = signal<{ label: string; value: string }[]>([]);
    productos = signal<{ label: string; value: string }[]>([]);

    estadoOpciones: { label: string; value: EstadoChecklist }[] = [
        { label: 'Aprobado',    value: 'APROBADO'    },
        { label: 'Rechazado',   value: 'RECHAZADO'   },
        { label: 'Observación', value: 'OBSERVACION' }
    ];

    form = this.fb.group({
        pasoLimpiezaId:         ['', Validators.required],
        productoCorrecto:       [false as boolean | null],
        concentracionCorrecta:  [false as boolean | null],
        superficieCubierta:     [false as boolean | null],
        tiempoCumplido:         [false as boolean | null],
        estado:                 [null as EstadoChecklist | null],
        observacion:            [null as string | null],
        productoQuimicoId:      [null as string | null],
        loteUsado:              [null as string | null],
        concentracionReal:      [null as number | null],
        volumenPreparadoLitros: [null as number | null]
    });

    async ngOnInit(): Promise<void> {
        const [pasos, productos] = await Promise.all([
            firstValueFrom(this.pasoService.getByPrograma(this.programaId)),
            firstValueFrom(this.productoService.getAll())
        ]);
        this.pasos.set(pasos.map(p => ({ label: `${p.orden}. ${p.descripcion}`, value: p.id })));
        this.productos.set(productos.map(p => ({ label: p.nombre, value: p.id })));

        if (this.item) {
            this.form.patchValue({
                pasoLimpiezaId:         this.item.pasoLimpiezaId,
                productoCorrecto:       this.item.productoCorrecto       ?? false,
                concentracionCorrecta:  this.item.concentracionCorrecta  ?? false,
                superficieCubierta:     this.item.superficieCubierta     ?? false,
                tiempoCumplido:         this.item.tiempoCumplido         ?? false,
                estado:                 this.item.estado                 ?? null,
                observacion:            this.item.observacion            ?? null,
                productoQuimicoId:      this.item.productoQuimicoId      ?? null,
                loteUsado:              this.item.loteUsado              ?? null,
                concentracionReal:      this.item.concentracionReal      ?? null,
                volumenPreparadoLitros: this.item.volumenPreparadoLitros ?? null
            });
            this.form.get('pasoLimpiezaId')!.disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.item) {
            const dto: UpdateChecklistLimpiezaDto = {
                productoCorrecto:       raw.productoCorrecto       ?? undefined,
                concentracionCorrecta:  raw.concentracionCorrecta  ?? undefined,
                superficieCubierta:     raw.superficieCubierta     ?? undefined,
                tiempoCumplido:         raw.tiempoCumplido         ?? undefined,
                estado:                 raw.estado                 ?? undefined,
                observacion:            raw.observacion            || undefined,
                productoQuimicoId:      raw.productoQuimicoId      || undefined,
                loteUsado:              raw.loteUsado              || undefined,
                concentracionReal:      raw.concentracionReal      ?? undefined,
                volumenPreparadoLitros: raw.volumenPreparadoLitros ?? undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateChecklistLimpiezaDto = {
                registroLimpiezaId:     this.registroLimpiezaId,
                pasoLimpiezaId:         raw.pasoLimpiezaId!,
                productoCorrecto:       raw.productoCorrecto       ?? undefined,
                concentracionCorrecta:  raw.concentracionCorrecta  ?? undefined,
                superficieCubierta:     raw.superficieCubierta     ?? undefined,
                tiempoCumplido:         raw.tiempoCumplido         ?? undefined,
                estado:                 raw.estado                 ?? undefined,
                observacion:            raw.observacion            || undefined,
                productoQuimicoId:      raw.productoQuimicoId      || undefined,
                loteUsado:              raw.loteUsado              || undefined,
                concentracionReal:      raw.concentracionReal      ?? undefined,
                volumenPreparadoLitros: raw.volumenPreparadoLitros ?? undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
