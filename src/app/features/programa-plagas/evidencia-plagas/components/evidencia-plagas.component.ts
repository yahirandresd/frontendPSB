import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { EvidenciaPlagasService } from '../services/evidencia-plagas.service';
import { Evidencia } from '../models/evidencia';

@Component({
    selector: 'app-evidencia-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './evidencia-plagas.component.html'
})
export class EvidenciaPlagasComponent implements OnInit {
    @Input() evidencia: Evidencia | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(EvidenciaPlagasService);
    guardando = false;

    form: Partial<Evidencia> = {
        tipoArchivo: undefined,
        urlArchivo: '',
        descripcion: '',
        fechaCarga: new Date()
    };

    readonly tiposArchivo = [
        { label: 'Imagen', value: 'imagen' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Video', value: 'video' }
    ];

    ngOnInit(): void {
        if (this.evidencia) this.form = { ...this.evidencia };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.tipoArchivo || !this.form.urlArchivo) return;
        this.guardando = true;
        try {
            if (this.evidencia?.id) {
                await firstValueFrom(this.service.actualizar(this.evidencia.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}