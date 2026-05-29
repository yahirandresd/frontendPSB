import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';
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
export class EvidenciaPlagasComponent implements OnInit, OnChanges {
    @Input() evidencia: Evidencia | null = null;
    @Input() registroPlagasId!: string; // ← recibir del padre
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(EvidenciaPlagasService);
    guardando = false;
 
    form: Partial<Evidencia> = {
        tipoArchivo: undefined,
        urlArchivo: '',
        descripcion: '',
        fecha_carga: new Date() // ← snake_case
    };
 
    readonly tiposArchivo = [
        { label: 'Imagen', value: 'imagen' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Video', value: 'video' }
    ];
 
    ngOnInit(): void { this.cargarForm(); }
    ngOnChanges(changes: SimpleChanges): void { if (changes['evidencia']) this.cargarForm(); }
 
    private cargarForm(): void {
        if (this.evidencia) {
            this.form = { ...this.evidencia };
        } else {
            this.form = { tipoArchivo: undefined, urlArchivo: '', descripcion: '', fecha_carga: new Date() };
        }
    }
 
    async onGuardar(): Promise<void> {
        if (!this.form.tipoArchivo || !this.form.urlArchivo) return;
        this.guardando = true;
        try {
            const payload = { ...this.form, registroPlagasId: this.registroPlagasId };
            if (this.evidencia?.id) {
                await firstValueFrom(this.service.actualizar(this.evidencia.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }
 
    onCancelar(): void { this.cancelado.emit(); }
}
 