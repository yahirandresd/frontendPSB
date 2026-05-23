import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { HallazgoService } from '../services/hallazgo.service';
import { Hallazgo } from '../models/hallazgo';

@Component({
    selector: 'app-hallazgo-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './hallazgos.html'
})
export class HallazgoPlagasComponent implements OnInit {
    @Input() hallazgo: Hallazgo | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(HallazgoService);
    guardando = false;

    form: Partial<Hallazgo> = {
        descripcion: '',
        severidad: undefined,
        estado: 'abierto',
        fecha: new Date()
    };

    readonly severidades = [
        { label: 'Leve', value: 'leve' },
        { label: 'Moderado', value: 'moderado' },
        { label: 'Grave', value: 'grave' },
        { label: 'Crítico', value: 'critico' }
    ];

    readonly estados = [
        { label: 'Abierto', value: 'abierto' },
        { label: 'En gestión', value: 'en_gestion' },
        { label: 'Cerrado', value: 'cerrado' }
    ];

    ngOnInit(): void {
        if (this.hallazgo) this.form = { ...this.hallazgo };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.descripcion || !this.form.severidad) return;
        this.guardando = true;
        try {
            if (this.hallazgo?.id) {
                await firstValueFrom(this.service.actualizar(this.hallazgo.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}