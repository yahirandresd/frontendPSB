
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { firstValueFrom } from 'rxjs';
import { DiagnosticoPlagasService } from '../services/diagnostico-plagas.service';
import { DiagnosticoInicial } from '../models/diagnostico-inicial';
@Component({
    selector: 'app-diagnostico-plagas',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule, ChipModule],
    templateUrl: './diagnostico.html'
})
export class DiagnosticoPlagasComponent implements OnInit {
    @Input() diagnostico: DiagnosticoInicial | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(DiagnosticoPlagasService);

    guardando = false;
    nuevaArea = '';
    nuevaPlaga = '';

    form: Partial<DiagnosticoInicial> = {
        fecha: new Date(),
        areasEvaluadas: [],
        plagasIdentificadas: [],
        nivelRiesgo: undefined,
        observaciones: ''
    };


    ngOnInit(): void {
        if (this.diagnostico) {
            this.form = {
                ...this.diagnostico,
                areasEvaluadas: [...(this.diagnostico.areasEvaluadas ?? [])],
                plagasIdentificadas: [...(this.diagnostico.plagasIdentificadas ?? [])]
            };
        }
    }

    agregarArea(): void {
        const val = this.nuevaArea.trim();
        if (val && !this.form.areasEvaluadas!.includes(val)) {
            this.form.areasEvaluadas = [...this.form.areasEvaluadas!, val];
        }
        this.nuevaArea = '';
    }

    quitarArea(area: string): void {
        this.form.areasEvaluadas = this.form.areasEvaluadas!.filter(a => a !== area);
    }

    agregarPlaga(): void {
        const val = this.nuevaPlaga.trim();
        if (val && !this.form.plagasIdentificadas!.includes(val)) {
            this.form.plagasIdentificadas = [...this.form.plagasIdentificadas!, val];
        }
        this.nuevaPlaga = '';
    }

    quitarPlaga(plaga: string): void {
        this.form.plagasIdentificadas = this.form.plagasIdentificadas!.filter(p => p !== plaga);
    }

    async onGuardar(): Promise<void> {
        if (!this.form.fecha || !this.form.nivelRiesgo) return;
        this.guardando = true;
        try {
            if (this.diagnostico?.id) {
                await firstValueFrom(this.service.actualizar(this.diagnostico.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally {
            this.guardando = false;
        }
    }

    onCancelar(): void { this.cancelado.emit(); }
}
