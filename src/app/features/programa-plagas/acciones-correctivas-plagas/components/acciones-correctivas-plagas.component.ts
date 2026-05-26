import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
export class AccionCorrectivaPlagasComponent implements OnInit {
    @Input() accion: AccionCorrectivaPlagas | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(AccionesCorrectivasPlagasService);
    guardando = false;

    form: Partial<AccionCorrectivaPlagas> = {
        descripcion: '',
        responsable: '',
        prioridad: undefined,
        estado: 'pendiente',
        fecha: new Date()
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

    ngOnInit(): void {
        if (this.accion) this.form = { ...this.accion };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.descripcion || !this.form.responsable || !this.form.prioridad) return;
        this.guardando = true;
        try {
            if (this.accion?.id) {
                await firstValueFrom(this.service.actualizar(this.accion.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}