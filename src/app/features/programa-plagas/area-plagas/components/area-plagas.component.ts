import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { AreaPlagasService } from '../services/area-plagas.service';
import { Area } from '../models/area';

@Component({
    selector: 'app-area-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './area-plagas.component.html'
})
export class AreaPlagasComponent implements OnInit {
    @Input() area: Area | null = null;
    @Input() programaPlagasId: string = '';
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(AreaPlagasService);

    guardando = false;

    form: Partial<Area> = {
        nombre: '',
        descripcion: '',
        nivelRiesgo: undefined
    };

    readonly nivelesRiesgo = [
        { label: 'Bajo', value: 'bajo' },
        { label: 'Medio', value: 'medio' },
        { label: 'Alto', value: 'alto' },
        { label: 'Crítico', value: 'critico' }
    ];

    ngOnInit(): void {
        if (this.area) {
            this.form = { ...this.area };
        }
    }

    async onGuardar(): Promise<void> {
        if (!this.form.nombre || !this.form.nivelRiesgo) return;

        this.guardando = true;
        try {
            const payload = { ...this.form, programaPlagasId: this.programaPlagasId };
            if (this.area?.id) {
                await firstValueFrom(this.service.actualizar(this.area.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
            // El page maneja el error via MessageService
        } finally {
            this.guardando = false;
        }
    }

    onCancelar(): void {
        this.cancelado.emit();
    }
}
