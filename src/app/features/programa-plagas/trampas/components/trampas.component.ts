import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { TrampasService } from '../services/trampas.service';
import { Trampa } from '../models/trampa';
 
@Component({
    selector: 'app-trampa-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './trampas.html'
})
export class TrampaFormComponent implements OnInit, OnChanges {
    @Input() trampa: Trampa | null = null;
    @Input() areaPlagaId!: string; // ← ID del área padre
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(TrampasService);
    guardando = false;
 
    // Campo auxiliar para accionesCorrectivas (string[] manejado como texto)
    accionesCorrectivasTexto = '';
 
    form: Partial<Trampa> = {
        codigo: '',
        tipo: '',
        ubicacion: '',
        estado: 'activa',
        fecha_instalacion: new Date(),
        fecha_revision: new Date(),
        accionesCorrectivas: []
    };
 
    readonly tipos = [
        { label: 'Pegajosa', value: 'pegajosa' },
        { label: 'Cebo', value: 'cebo' },
        { label: 'Eléctrica', value: 'electrica' },
        { label: 'Jaula', value: 'jaula' },
        { label: 'Feromonas', value: 'feromonas' }
    ];
 
    readonly estados = [
        { label: 'Activa', value: 'activa' },
        { label: 'Inactiva', value: 'inactiva' },
        { label: 'En mantenimiento', value: 'mantenimiento' }
    ];
 
    ngOnInit(): void {
        this.cargarForm();
    }
 
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['trampa']) this.cargarForm();
    }
 
    private cargarForm(): void {
        if (this.trampa) {
            this.form = { ...this.trampa };
            this.accionesCorrectivasTexto = (this.trampa.accionesCorrectivas ?? []).join('\n');
        } else {
            this.form = {
                codigo: '', tipo: '', ubicacion: '', estado: 'activa',
                fecha_instalacion: new Date(), fecha_revision: new Date(),
                accionesCorrectivas: []
            };
            this.accionesCorrectivasTexto = '';
        }
    }
 
    async onGuardar(): Promise<void> {
        if (!this.form.codigo || !this.form.tipo) return;
        this.guardando = true;
        try {
            this.form.accionesCorrectivas = this.accionesCorrectivasTexto
                .split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const payload = { ...this.form, areaPlagaId: this.areaPlagaId };
            if (this.trampa?.id) {
                await firstValueFrom(this.service.actualizar(this.trampa.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }
 
    onCancelar(): void { this.cancelado.emit(); }
}
 