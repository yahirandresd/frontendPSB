import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { AccionesCorrectivasPlagasService } from '../services/acciones-correctivas-plagas.service';
import { AccionCorrectivaPlagas } from '../models/accion-correctiva-plagas';

@Component({
    selector: 'app-accion-correctiva-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './acciones-correctivas-plagas.html'
})
export class AccionCorrectivaPlagasComponent implements OnInit, OnChanges {
    @Input() accion: AccionCorrectivaPlagas | null = null;
    @Input() hallazgoPlagaId!: string;  // ← recibir del padre
    @Input() plaguicidas: { label: string; value: string }[] = []; // ← lista para el select
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(AccionesCorrectivasPlagasService);
    guardando = false;

    form: Partial<AccionCorrectivaPlagas> = {
        descripcion: '',
        responsable: '',
        prioridad: undefined,
        estado: 'pendiente',
        fecha: new Date(),
        plaguicidaId: ''
    };

    readonly prioridades = [
        { label: 'Baja', value: 'baja' },
        { label: 'Media', value: 'media' },
        { label: 'Alta', value: 'alta' },
        { label: 'Inmediata', value: 'inmediata' }
    ];

    readonly estados = [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'En ejecución', value: 'en_ejecucion' },
        { label: 'Cerrada', value: 'cerrada' }
    ];

    ngOnInit(): void { this.cargarForm(); }
    ngOnChanges(changes: SimpleChanges): void { if (changes['accion']) this.cargarForm(); }

    private cargarForm(): void {
        if (this.accion) {
            this.form = { ...this.accion };
        } else {
            this.form = {
                descripcion: '', responsable: '', prioridad: undefined,
                estado: 'pendiente', fecha: new Date(), plaguicidaId: ''
            };
        }
    }

    async onGuardar(): Promise<void> {
        console.log('form:', this.form);
        console.log('hallazgoPlagaId:', this.hallazgoPlagaId);
        console.log('plaguicidaId tipo:', typeof this.form.plaguicidaId);
        console.log('plaguicidaId:', this.form.plaguicidaId);
        if (!this.form.descripcion || !this.form.responsable || !this.form.prioridad || !this.form.plaguicidaId) return;
        this.guardando = true;
        try {
            const payload = { ...this.form, hallazgoPlagaId: this.hallazgoPlagaId };
            if (this.accion?.id) {
                await firstValueFrom(this.service.actualizar(this.accion.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}