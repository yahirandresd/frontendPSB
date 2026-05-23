import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';
import { TrampasService } from '../services/trampas.service';
import { Trampa } from '../models/trampa';

@Component({
    selector: 'app-trampa-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule],
    templateUrl: './trampas.html',
})
export class TrampaComponent implements OnInit {
    @Input() trampa: Trampa | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(TrampasService);
    guardando = false;

    form: Partial<Trampa> = {
        codigo: '', tipo: '', ubicacion: '',
        estado: 'activa',
        fechaInstalacion: new Date(),
        ultimaRevision: new Date()
    };

    readonly tiposTrampa = [
        { label: 'Cebo', value: 'cebo' },
        { label: 'Insectocutor', value: 'insectocutor' },
        { label: 'Trampa adhesiva', value: 'trampa-adhesiva' },
        { label: 'Jaula', value: 'jaula' }
    ];

    readonly estados = [
        { label: 'Activa', value: 'activa' },
        { label: 'Inactiva', value: 'inactiva' },
        { label: 'En mantenimiento', value: 'mantenimiento' }
    ];

    ngOnInit(): void {
        if (this.trampa) this.form = { ...this.trampa };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.codigo || !this.form.tipo || !this.form.ubicacion) return;
        this.guardando = true;
        try {
            if (this.trampa?.id) {
                await firstValueFrom(this.service.actualizar(this.trampa.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}