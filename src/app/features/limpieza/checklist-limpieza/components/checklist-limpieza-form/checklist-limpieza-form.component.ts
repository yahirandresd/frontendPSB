import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ChecklistLimpieza } from '../../models/checklist-limpieza.interface';
import { CreateChecklistLimpiezaDto } from '../../models/create-checklist-limpieza.dto';
import { UpdateChecklistLimpiezaDto } from '../../models/update-checklist-limpieza.dto';

@Component({
    selector: 'app-checklist-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, CheckboxModule],
    templateUrl: './checklist-limpieza-form.component.html',
    styleUrls: ['./checklist-limpieza-form.component.scss']
})
export class ChecklistLimpiezaFormComponent implements OnInit {
    @Input() item?: ChecklistLimpieza;
    @Input() registroId!: string;
    @Output() formSubmit = new EventEmitter<CreateChecklistLimpiezaDto | UpdateChecklistLimpiezaDto>();

    private fb = inject(FormBuilder);

    form = this.fb.group({
        registroId:    ['', Validators.required],
        pasoId:        ['', Validators.required],
        completado:    [false],
        observaciones: ['']
    });

    ngOnInit(): void {
        this.form.patchValue({ registroId: this.registroId });
        this.form.get('registroId')!.disable();

        if (this.item) {
            this.form.patchValue(this.item);
            this.form.get('pasoId')!.disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.item) {
            const dto: UpdateChecklistLimpiezaDto = {
                completado:    raw.completado    ?? undefined,
                observaciones: raw.observaciones || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateChecklistLimpiezaDto = {
                registroId:    raw.registroId!,
                pasoId:        raw.pasoId!,
                completado:    raw.completado ?? undefined,
                observaciones: raw.observaciones || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
