import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { firstValueFrom } from 'rxjs';
import { CronogramaService } from '../services/cronograma.service';
import { Cronograma } from '../models/cronograma';
 
@Component({
    selector: 'app-cronograma-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, InputNumberModule],
    templateUrl: './cronograma.html'
})
export class CronogramaComponent implements OnInit {
    @Input() cronograma: Cronograma | null = null;
    @Input() programaPlagasId!: string; // ← recibir del padre
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(CronogramaService);
    guardando = false;
 
    form: Partial<Cronograma> = {
        anioVigencia: new Date().getFullYear(),
        frecuenciaControl: '',
        metodoControl: '',
        responsable: ''
        // ← actividades eliminado: no existe en el DTO del backend
    };
 
    readonly frecuencias = ['Mensual', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
    readonly metodos = ['Químico', 'Biológico', 'Físico', 'Integrado'];
 
    ngOnInit(): void {
        if (this.cronograma) {
            this.form = { ...this.cronograma };
        } else {
            this.form.programaPlagasId = this.programaPlagasId;
        }
    }
        ngOnChanges(changes: SimpleChanges): void {
        if (changes['cronograma']) {
            if (this.cronograma) {
                this.form = { ...this.cronograma };
            } else {
                this.form = {
                    anioVigencia: new Date().getFullYear(),
                    frecuenciaControl: '',
                    metodoControl: '',
                    responsable: ''
                };
            }
        }
    }

 
    async onGuardar(): Promise<void> {
        if (!this.form.anioVigencia || !this.form.responsable) return;
        this.guardando = true;
        try {
            // Excluye actividades del payload — no está en el DTO
            const { actividades, ...payload } = this.form as any;
            const data = { ...payload, programaPlagasId: this.programaPlagasId };
            if (this.cronograma?.id) {
                await firstValueFrom(this.service.actualizar(this.cronograma.id, data));
            } else {
                await firstValueFrom(this.service.crear(data));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }
 
    onCancelar(): void { this.cancelado.emit(); }
}