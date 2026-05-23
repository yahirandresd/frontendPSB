import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { firstValueFrom } from 'rxjs';
import { CronogramaService } from '../services/cronograma.service';
import { Cronograma, ActividadCronograma } from '../models/cronograma';

@Component({
    selector: 'app-cronograma-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, InputNumberModule],
    templateUrl: './cronograma.html'
})
export class CronogramaComponent implements OnInit {
    @Input() cronograma: Cronograma | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(CronogramaService);
    guardando = false;
    nuevaActividad: Partial<ActividadCronograma> = { mes: 1, descripcion: '', ejecutada: false };

    form: Partial<Cronograma> = {
        anioVigencia: new Date().getFullYear(),
        frecuenciaControl: '',
        metodoControl: '',
        responsable: '',
        actividades: []
    };

    readonly meses = [
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
    ].map((label, i) => ({ label, value: i + 1 }));

    readonly frecuencias = ['Mensual', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
    readonly metodos = ['Químico', 'Biológico', 'Físico', 'Integrado'];

    ngOnInit(): void {
        if (this.cronograma) {
            this.form = { ...this.cronograma, actividades: [...(this.cronograma.actividades ?? [])] };
        }
    }

    agregarActividad(): void {
        if (!this.nuevaActividad.descripcion?.trim()) return;
        this.form.actividades = [...this.form.actividades!, {
            id: crypto.randomUUID(),
            mes: this.nuevaActividad.mes!,
            descripcion: this.nuevaActividad.descripcion!,
            plaguicidaId: '',
            ejecutada: false
        }];
        this.nuevaActividad = { mes: 1, descripcion: '', ejecutada: false };
    }

    quitarActividad(id: string): void {
        this.form.actividades = this.form.actividades!.filter(a => a.id !== id);
    }

    getNombreMes(num: number): string {
        return this.meses[num - 1]?.label ?? '';
    }

    async onGuardar(): Promise<void> {
        if (!this.form.anioVigencia || !this.form.responsable) return;
        this.guardando = true;
        try {
            if (this.cronograma?.id) {
                await firstValueFrom(this.service.actualizar(this.cronograma.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}