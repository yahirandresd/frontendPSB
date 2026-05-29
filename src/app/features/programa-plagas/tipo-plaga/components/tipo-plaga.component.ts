import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';
import { TipoPlagaService } from '../services/tipo-plaga.service';
import { TipoPlaga } from '../models/tipo-plaga';

@Component({
    selector: 'app-tipo-plaga-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule],
    templateUrl: './tipo-plaga.component.html'
})
export class TipoPlagaComponent implements OnInit {
    @Input() tipoPlaga: TipoPlaga | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(TipoPlagaService);
    guardando = false;

    form: Partial<TipoPlaga> = {
        nombre: '',
        categoria: '',
        riesgoSanitario: '',
    };

    readonly categorias = [
        { label: 'Roedor', value: 'roedor' },
        { label: 'Insecto', value: 'insecto' },
        { label: 'Ave', value: 'ave' },
        { label: 'Quiróptero', value: 'quiroptero' }
    ];

    readonly nivelesRiesgo = ['BAJO', 'MEDIO', 'ALTO', 'MUY ALTO'];

    ngOnInit(): void {
        if (this.tipoPlaga) this.form = { ...this.tipoPlaga };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tipoPlaga']) {
            if (this.tipoPlaga) {
                this.form = { ...this.tipoPlaga };
            } else {
                this.form = {
                    nombre: '',
                    categoria: '',
                    riesgoSanitario: '',
                };
            }
        }
    }

    async onGuardar(): Promise<void> {
        if (!this.form.nombre || !this.form.categoria) return;
        this.guardando = true;
        try {
            if (this.tipoPlaga?.id) {
                await firstValueFrom(this.service.actualizar(this.tipoPlaga.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}