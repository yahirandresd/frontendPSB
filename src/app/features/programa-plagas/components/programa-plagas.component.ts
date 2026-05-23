import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { ProgramaPlagasService } from '../services/control-plagas.service';
import { ProgramaPlagas } from '../models/programa-plagas';

@Component({
    selector: 'app-programa-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule],
    templateUrl: './programa-plagas.component.html'
})
export class ProgramaPlagasFormComponent implements OnInit {
    @Input() programa: ProgramaPlagas | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(ProgramaPlagasService);

    guardando = false;

    form: Partial<ProgramaPlagas> = {
        objetivo: '',
        alcance: '',
        procedimientoGeneral: ''
    };

    ngOnInit(): void {
        if (this.programa) {
            this.form = { ...this.programa };
        }
    }

    async onGuardar(): Promise<void> {
        if (!this.form.objetivo || !this.form.alcance) return;

        this.guardando = true;
        try {
            if (this.programa?.id) {
                await firstValueFrom(this.service.actualizar(this.programa.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
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

