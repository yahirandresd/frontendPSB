import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { DiagnosticoPlagasService } from '../services/diagnostico-plagas.service';
import { DiagnosticoInicial } from '../models/diagnostico-inicial';
 
@Component({
    selector: 'app-diagnostico-plagas',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './diagnostico.html'
})
export class DiagnosticoPlagasComponent implements OnInit {
    @Input() diagnostico: DiagnosticoInicial | null = null;
    @Input() programaPlagasId!: string; // ← recibir del padre
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(DiagnosticoPlagasService);
    guardando = false;
 
    form: Partial<DiagnosticoInicial> = {
        fecha: new Date(),
        areasEvaluadas: '',    // ← string simple
        plagasIdentificadas: '', // ← string simple
        nivelRiesgo: undefined,
        observaciones: ''
    };
 
    readonly nivelesRiesgo = [
        { label: 'Bajo', value: 'BAJO' },
        { label: 'Medio', value: 'MEDIO' },
        { label: 'Alto', value: 'ALTO' }
    ];
 
    ngOnInit(): void {
        if (this.diagnostico) {
            this.form = { ...this.diagnostico };
        } else {
            this.form.programaPlagasId = this.programaPlagasId;
        }
    }
        ngOnChanges(changes: SimpleChanges): void {
        if (changes['diagnostico']) {
            if (this.diagnostico) {
                this.form = { ...this.diagnostico };
            } else {
                this.form = {
                    fecha: new Date(),
                    areasEvaluadas: '',
                    plagasIdentificadas: '',
                    nivelRiesgo: undefined,
                    observaciones: ''
                };
            }
        }
    }

 
    async onGuardar(): Promise<void> {
        if (!this.form.fecha || !this.form.nivelRiesgo) return;
        this.guardando = true;
        try {
            const payload = { ...this.form, programaPlagasId: this.programaPlagasId };
            if (this.diagnostico?.id) {
                await firstValueFrom(this.service.actualizar(this.diagnostico.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }
 
    onCancelar(): void { this.cancelado.emit(); }
}